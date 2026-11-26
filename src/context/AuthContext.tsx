import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  auth,
  authPersistenceReady,
  db,
  formatFirebaseAuthError,
  googleProvider,
  handleFirestoreError,
  isEmbeddedFrame,
  isStandalonePwa,
  OperationType,
  type FormattedFirebaseAuthError,
} from '../lib/firebase';
import { apiFetch } from '../lib/api';
import type { StudentProfile, TeacherStatus, UserProfile } from '../types/curriculum';

export const ADMIN_EMAIL = 'komaljamui26@gmail.com';
export type GoogleSignInMethod = 'auto' | 'popup' | 'redirect';
const REDIRECT_PENDING_KEY = 'ias_google_redirect_pending';

interface OnboardingInput {
  displayName: string;
  role: 'student' | 'teacher';
  classNumber: number;
  preferredLanguage: 'English' | 'Hindi';
  dailyGoalMinutes: number;
  specialization?: string;
  inviteCode?: string;
}

interface AdminBootstrapInput {
  email: string;
  password: string;
  displayName: string;
}

interface AuthContextValue {
  firebaseUser: User | null;
  profile: UserProfile | null;
  studentProfile: StudentProfile | null;
  adminToken: string | null;
  loading: boolean;
  googleSigningIn: boolean;
  needsOnboarding: boolean;
  authError: string | null;
  authErrorDetails: FormattedFirebaseAuthError | null;
  clearAuthError: () => void;
  signInWithGoogle: (method?: GoogleSignInMethod) => Promise<void>;
  loginAdminWithCredentials: (email: string, password: string) => Promise<void>;
  bootstrapAdminAccount: (input: AdminBootstrapInput) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (input: OnboardingInput) => Promise<void>;
  updateProfileFields: (
    fields: Partial<
      Pick<UserProfile, 'displayName' | 'classNumber' | 'preferredLanguage' | 'dailyGoalMinutes' | 'specialization'>
    >
  ) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getCachedProfileKey(uid: string) {
  return `ias_profile_${uid}`;
}

function buildAdminUserProfile(admin: { uid: string; email: string; displayName: string }): UserProfile {
  return {
    uid: admin.uid,
    email: admin.email,
    displayName: admin.displayName || 'Indo American School Admin',
    role: 'admin',
    teacherStatus: 'approved',
    classNumber: 10,
    board: 'CBSE',
    preferredLanguage: 'English',
    dailyGoalMinutes: 60,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  // Strictly in-memory session token for backend Admin APIs (never persisted in localStorage/sessionStorage)
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [googleSigningIn, setGoogleSigningIn] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authErrorDetails, setAuthErrorDetails] = useState<FormattedFirebaseAuthError | null>(null);

  const clearAuthError = () => {
    setAuthError(null);
    setAuthErrorDetails(null);
  };

  const syncTeacherWithBackend = async (user: User, teacherData: UserProfile): Promise<TeacherStatus | null> => {
    if (!navigator.onLine) return null;
    try {
      const idToken = await user.getIdToken();
      const res = await apiFetch('/api/teachers/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          displayName: teacherData.displayName,
          classNumber: teacherData.classNumber,
          preferredLanguage: teacherData.preferredLanguage,
          specialization: teacherData.specialization,
          inviteCodeUsed: teacherData.inviteCodeUsed,
          firestoreApproved: teacherData.teacherStatus === 'approved',
        }),
      });
      if (res.ok) {
        const json = (await res.json()) as { teacher?: { teacherStatus?: TeacherStatus } };
        return json.teacher?.teacherStatus ?? null;
      }
    } catch {
      // ignore transient sync failure when offline
    }
    return null;
  };

  const fetchBackendTeacherStatus = async (user: User): Promise<TeacherStatus | null> => {
    if (!navigator.onLine) return null;
    try {
      const idToken = await user.getIdToken();
      const res = await apiFetch('/api/teachers/status', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.ok) {
        const json = (await res.json()) as { found?: boolean; teacherStatus?: TeacherStatus | null };
        if (json.found && json.teacherStatus) {
          return json.teacherStatus;
        }
      }
    } catch {
      // ignore transient error
    }
    return null;
  };

  const exchangeGoogleAdminToken = async (user: User) => {
    if (!navigator.onLine) return;
    try {
      const idToken = await user.getIdToken();
      const res = await apiFetch('/api/admin/google-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (res.ok) {
        const json = (await res.json()) as { token?: string };
        if (json.token) {
          setAdminToken(json.token);
        }
      }
    } catch {
      // ignore transient error
    }
  };

  const loadUserRecords = async (user: User) => {
    const userPath = `users/${user.uid}`;
    const spPath = `studentProfiles/${user.uid}`;

    try {
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      if (userSnap.exists()) {
        let data = userSnap.data() as UserProfile;

        if (data.role === 'teacher') {
          const syncedStatus = await syncTeacherWithBackend(user, data);
          const authoritativeStatus = syncedStatus ?? (await fetchBackendTeacherStatus(user));
          if (authoritativeStatus && data.teacherStatus !== 'approved') {
            data = { ...data, teacherStatus: authoritativeStatus };
          }
        } else if (data.role === 'admin' && user.email === ADMIN_EMAIL) {
          await exchangeGoogleAdminToken(user);
        }

        setProfile(data);
        setNeedsOnboarding(false);
        try {
          localStorage.setItem(getCachedProfileKey(user.uid), JSON.stringify(data));
        } catch {
          // ignore storage quota errors
        }

        if (data.role === 'student') {
          const spSnap = await getDoc(doc(db, 'studentProfiles', user.uid));
          if (spSnap.exists()) {
            setStudentProfile(spSnap.data() as StudentProfile);
          } else {
            const initialSp: StudentProfile = {
              uid: user.uid,
              displayName: data.displayName,
              classNumber: data.classNumber,
              xp: 50,
              streakDays: 1,
              lessonsCompleted: 0,
              avgQuizScore: 0,
              badges: ['First Step'],
            };
            await setDoc(doc(db, 'studentProfiles', user.uid), {
              ...initialSp,
              updatedAt: serverTimestamp(),
            });
            setStudentProfile(initialSp);
          }
        }
      } else if (user.email === ADMIN_EMAIL) {
        // Bootstrap Google administrator profile automatically
        const adminProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Indo American School Admin',
          role: 'admin',
          teacherStatus: 'approved',
          classNumber: 10,
          board: 'CBSE',
          preferredLanguage: 'English',
          dailyGoalMinutes: 60,
        };
        await setDoc(doc(db, 'users', user.uid), {
          ...adminProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        await setDoc(doc(db, 'admins', user.uid), {
          uid: user.uid,
          createdAt: serverTimestamp(),
        });
        await exchangeGoogleAdminToken(user);
        setProfile(adminProfile);
        setNeedsOnboarding(false);
      } else {
        setProfile(null);
        setNeedsOnboarding(true);
      }
    } catch (err) {
      // Fallback to cached profile if offline
      if (!navigator.onLine) {
        const cached = localStorage.getItem(getCachedProfileKey(user.uid));
        if (cached) {
          setProfile(JSON.parse(cached) as UserProfile);
          setNeedsOnboarding(false);
          return;
        }
      }
      console.error(`Failed loading user records (${userPath} / ${spPath}):`, err);
      const formatted: FormattedFirebaseAuthError = {
        code: 'firestore/profile-load-failed',
        message: 'Signed in with Google, but could not load your school profile. Please check your connection and retry.',
      };
      setAuthError(formatted.message);
      setAuthErrorDetails(formatted);
    }
  };

  useEffect(() => {
    let mounted = true;
    let authStateInitialized = false;
    let redirectChecked = false;

    const finishInitialLoading = () => {
      if (mounted && authStateInitialized && redirectChecked) {
        setLoading(false);
      }
    };

    const initializeAuth = async () => {
      await authPersistenceReady;
      if (!mounted) return;

      getRedirectResult(auth)
        .then((result) => {
          if (!mounted) return;
          let wasPending = false;
          try {
            wasPending = sessionStorage.getItem(REDIRECT_PENDING_KEY) === '1';
            sessionStorage.removeItem(REDIRECT_PENDING_KEY);
          } catch {
            // ignore storage errors
          }

          if (result?.user) {
            setAuthError(null);
            setAuthErrorDetails(null);
          } else if (wasPending && !auth.currentUser) {
            const incompleteErr: FormattedFirebaseAuthError = {
              code: 'auth/redirect-incomplete',
              message:
                'Google Redirect Sign-In did not complete. Your browser may have blocked cross-site storage during the redirect.',
              hint: 'Try standard Google Sign-In (popup) or enable cookies for accounts.google.com.',
            };
            setAuthError(incompleteErr.message);
            setAuthErrorDetails(incompleteErr);
          }
        })
        .catch((err) => {
          if (!mounted) return;
          try {
            sessionStorage.removeItem(REDIRECT_PENDING_KEY);
          } catch {
            // ignore storage errors
          }
          const formatted = formatFirebaseAuthError(err);
          console.error('Google redirect auth error:', formatted.code, err);
          setAuthError(formatted.message);
          setAuthErrorDetails(formatted);
        })
        .finally(() => {
          redirectChecked = true;
          finishInitialLoading();
        });
    };

    void initializeAuth();

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!mounted) return;
      setFirebaseUser(user);
      if (user) {
        try {
          sessionStorage.removeItem(REDIRECT_PENDING_KEY);
        } catch {
          // ignore storage errors
        }
        setAuthError(null);
        setAuthErrorDetails(null);
        await loadUserRecords(user);
      } else {
        setAdminToken((currentToken) => {
          if (!currentToken) {
            setProfile(null);
            setStudentProfile(null);
            setNeedsOnboarding(false);
          }
          return currentToken;
        });
      }
      authStateInitialized = true;
      finishInitialLoading();
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  const signInWithGoogle = async (method: GoogleSignInMethod = 'auto') => {
    if (googleSigningIn) {
      return;
    }

    setAuthError(null);
    setAuthErrorDetails(null);
    setAdminToken(null);
    setGoogleSigningIn(true);

    const embedded = isEmbeddedFrame();
    const preferRedirect =
      method === 'redirect' || (method === 'auto' && !embedded && isStandalonePwa());

    try {
      await authPersistenceReady;

      if (embedded && method === 'redirect') {
        const embeddedErr: FormattedFirebaseAuthError = {
          code: 'auth/embedded-redirect-blocked',
          message: 'Full-page Google Redirect Sign-In cannot run inside an embedded frame.',
          hint: 'Open this app in a new tab to use redirect sign-in, or click "Continue with Google" to use the popup.',
          requiresNewTab: true,
        };
        setAuthError(embeddedErr.message);
        setAuthErrorDetails(embeddedErr);
        throw new Error(embeddedErr.message);
      }

      if (preferRedirect && !embedded) {
        try {
          sessionStorage.setItem(REDIRECT_PENDING_KEY, '1');
        } catch {
          // ignore storage errors
        }
        await signInWithRedirect(auth, googleProvider);
        return;
      }

      try {
        await signInWithPopup(auth, googleProvider);
      } catch (popupErr) {
        const formattedPopup = formatFirebaseAuthError(popupErr);
        if (
          (formattedPopup.code === 'auth/popup-blocked' ||
            formattedPopup.code === 'auth/operation-not-supported-in-this-environment') &&
          !embedded &&
          method === 'auto'
        ) {
          try {
            sessionStorage.setItem(REDIRECT_PENDING_KEY, '1');
          } catch {
            // ignore storage errors
          }
          await signInWithRedirect(auth, googleProvider);
          return;
        }
        throw popupErr;
      }
    } catch (err) {
      try {
        sessionStorage.removeItem(REDIRECT_PENDING_KEY);
      } catch {
        // ignore storage errors
      }
      const formatted = formatFirebaseAuthError(err);
      console.error('Google Sign-In error:', formatted.code, err);
      setAuthError(formatted.message);
      setAuthErrorDetails(formatted);
      throw new Error(formatted.message);
    } finally {
      setGoogleSigningIn(false);
    }
  };

  const parseAuthJsonResponse = async <T extends { error?: string }>(
    res: Response,
    fallbackMessage: string
  ): Promise<T> => {
    const contentType = res.headers.get('content-type') || '';
    const rawText = await res.text().catch(() => '');

    if (rawText) {
      try {
        return JSON.parse(rawText) as T;
      } catch {
        // Not valid JSON (e.g. HTML 405/404 from SPA fallback or gateway error)
      }
    }

    if (contentType.includes('text/html') || rawText.trimStart().startsWith('<!doctype') || rawText.trimStart().startsWith('<html')) {
      throw new Error(
        'Unable to reach the backend Admin API (received an HTML page instead of JSON). Please verify the backend API URL or proxy configuration.'
      );
    }

    if (!res.ok) {
      throw new Error(`${fallbackMessage} (HTTP ${res.status})`);
    }

    throw new Error(fallbackMessage);
  };

  const loginAdminWithCredentials = async (email: string, password: string) => {
    setAuthError(null);
    let data: {
      error?: string;
      token?: string;
      admin?: { uid: string; email: string; displayName: string; role: 'admin' };
    };
    try {
      const res = await apiFetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      data = await parseAuthJsonResponse(res, 'Admin authentication failed.');
      if (!res.ok || !data.token || !data.admin) {
        throw new Error(data.error || 'Admin authentication failed.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Admin authentication failed.';
      setAuthError(message);
      throw new Error(message);
    }

    if (auth.currentUser) {
      await signOut(auth).catch(() => undefined);
    }
    setFirebaseUser(null);
    setStudentProfile(null);
    setNeedsOnboarding(false);
    setAdminToken(data.token);
    setProfile(buildAdminUserProfile(data.admin));
  };

  const bootstrapAdminAccount = async (input: AdminBootstrapInput) => {
    setAuthError(null);
    let data: {
      error?: string;
      token?: string;
      admin?: { uid: string; email: string; displayName: string; role: 'admin' };
    };
    try {
      const res = await apiFetch('/api/admin/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: input.email.trim(),
          password: input.password,
          displayName: input.displayName.trim(),
        }),
      });
      data = await parseAuthJsonResponse(res, 'Unable to initialize Admin account.');
      if (!res.ok || !data.token || !data.admin) {
        throw new Error(data.error || 'Unable to initialize Admin account.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to initialize Admin account.';
      setAuthError(message);
      throw new Error(message);
    }

    if (auth.currentUser) {
      await signOut(auth).catch(() => undefined);
    }
    setFirebaseUser(null);
    setStudentProfile(null);
    setNeedsOnboarding(false);
    setAdminToken(data.token);
    setProfile(buildAdminUserProfile(data.admin));
  };

  const logout = async () => {
    setAdminToken(null);
    if (auth.currentUser) {
      await signOut(auth);
    }
    setFirebaseUser(null);
    setProfile(null);
    setStudentProfile(null);
    setNeedsOnboarding(false);
    setAuthError(null);
    setAuthErrorDetails(null);
  };

  const completeOnboarding = async (input: OnboardingInput) => {
    if (!firebaseUser || !firebaseUser.email) {
      throw new Error('Please sign in with Google first.');
    }
    const uid = firebaseUser.uid;
    const cleanName = input.displayName.trim() || firebaseUser.displayName || 'Indo American School Learner';
    const cleanCode = input.inviteCode?.trim() ?? '';

    if (input.role === 'teacher' && cleanCode) {
      const invRef = doc(db, 'teacherInvitations', cleanCode);
      const invSnap = await getDoc(invRef);
      if (invSnap.exists()) {
        const invData = invSnap.data() as { used: boolean };
        if (invData.used) {
          throw new Error('This teacher invitation code has already been used.');
        }

        const teacherProfile: UserProfile = {
          uid,
          email: firebaseUser.email,
          displayName: cleanName,
          role: 'teacher',
          teacherStatus: 'approved',
          classNumber: input.classNumber,
          board: 'CBSE',
          preferredLanguage: input.preferredLanguage,
          dailyGoalMinutes: input.dailyGoalMinutes,
          inviteCodeUsed: cleanCode,
          ...(input.specialization?.trim() ? { specialization: input.specialization.trim() } : {}),
        };

        try {
          const batch = writeBatch(db);
          batch.set(doc(db, 'users', uid), {
            ...teacherProfile,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          batch.update(invRef, {
            used: true,
            usedBy: uid,
          });
          await batch.commit();
          await syncTeacherWithBackend(firebaseUser, teacherProfile);
          setProfile(teacherProfile);
          setNeedsOnboarding(false);
          localStorage.setItem(getCachedProfileKey(uid), JSON.stringify(teacherProfile));
          return;
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
        }
      }
    }

    const userDoc: UserProfile = {
      uid,
      email: firebaseUser.email,
      displayName: cleanName,
      role: input.role,
      teacherStatus: input.role === 'teacher' ? 'pending' : 'none',
      classNumber: input.classNumber,
      board: 'CBSE',
      preferredLanguage: input.preferredLanguage,
      dailyGoalMinutes: input.dailyGoalMinutes,
      ...(input.specialization?.trim() ? { specialization: input.specialization.trim() } : {}),
      ...(cleanCode && input.role === 'teacher' ? { inviteCodeUsed: cleanCode } : {}),
    };

    try {
      await setDoc(doc(db, 'users', uid), {
        ...userDoc,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      let effectiveProfile = userDoc;
      if (input.role === 'teacher') {
        const backendStatus = await syncTeacherWithBackend(firebaseUser, userDoc);
        if (backendStatus) {
          effectiveProfile = { ...userDoc, teacherStatus: backendStatus };
        }
      }

      if (input.role === 'student') {
        const initialSp: StudentProfile = {
          uid,
          displayName: cleanName,
          classNumber: input.classNumber,
          xp: 50,
          streakDays: 1,
          lessonsCompleted: 0,
          avgQuizScore: 0,
          badges: ['First Step'],
        };
        await setDoc(doc(db, 'studentProfiles', uid), {
          ...initialSp,
          updatedAt: serverTimestamp(),
        });
        setStudentProfile(initialSp);
      }

      setProfile(effectiveProfile);
      setNeedsOnboarding(false);
      localStorage.setItem(getCachedProfileKey(uid), JSON.stringify(effectiveProfile));
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${uid}`);
    }
  };

  const updateProfileFields = async (
    fields: Partial<
      Pick<UserProfile, 'displayName' | 'classNumber' | 'preferredLanguage' | 'dailyGoalMinutes' | 'specialization'>
    >
  ) => {
    if (!firebaseUser || !profile) return;
    const uid = firebaseUser.uid;
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...fields,
        updatedAt: serverTimestamp(),
      });
      if (profile.role === 'student' && (fields.displayName || fields.classNumber)) {
        const spUpdates: Record<string, unknown> = { updatedAt: serverTimestamp() };
        if (fields.displayName) spUpdates.displayName = fields.displayName;
        if (fields.classNumber) spUpdates.classNumber = fields.classNumber;
        await updateDoc(doc(db, 'studentProfiles', uid), spUpdates);
      }
      await loadUserRecords(firebaseUser);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
    }
  };

  const refreshProfile = async () => {
    if (firebaseUser) {
      await loadUserRecords(firebaseUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        profile,
        studentProfile,
        adminToken,
        loading,
        googleSigningIn,
        needsOnboarding,
        authError,
        authErrorDetails,
        clearAuthError,
        signInWithGoogle,
        loginAdminWithCredentials,
        bootstrapAdminAccount,
        logout,
        completeOnboarding,
        updateProfileFields,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

