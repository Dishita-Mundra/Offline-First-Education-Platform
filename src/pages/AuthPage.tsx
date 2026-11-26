import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  GraduationCap,
  HelpCircle,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { SCHOOL_BRAND } from '../config/schoolImages';
import { useAuth, type GoogleSignInMethod } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import {
  checkFirebaseDomainAuthorization,
  formatFirebaseAuthError,
  isEmbeddedFrame,
  type FirebaseDomainCheckResult,
} from '../lib/firebase';

interface AdminStatusResponse {
  configured: boolean;
  bootstrapRequired: boolean;
  envConfigured: boolean;
  storageMode: string;
}

export default function AuthPage({
  mode = 'login',
  initialPortal,
}: {
  mode?: 'login' | 'register';
  initialPortal?: 'member' | 'admin';
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    firebaseUser,
    adminToken,
    profile,
    loading,
    googleSigningIn,
    needsOnboarding,
    authError,
    authErrorDetails,
    clearAuthError,
    signInWithGoogle,
    loginAdminWithCredentials,
    bootstrapAdminAccount,
    completeOnboarding,
    refreshProfile,
    logout,
  } = useAuth();

  const embedded = isEmbeddedFrame();
  const [domainStatus, setDomainStatus] = useState<FirebaseDomainCheckResult | null>(null);

  const defaultPortal =
    initialPortal ?? (searchParams.get('portal') === 'admin' ? 'admin' : 'member');
  const [portal, setPortal] = useState<'member' | 'admin'>(defaultPortal);

  // Student / Teacher onboarding state
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [displayName, setDisplayName] = useState('');
  const [classNumber, setClassNumber] = useState<number>(8);
  const [preferredLanguage, setPreferredLanguage] = useState<'English' | 'Hindi'>('English');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(45);
  const [specialization, setSpecialization] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Admin credential auth state
  const [adminStatus, setAdminStatus] = useState<AdminStatusResponse | null>(null);
  const [adminStatusLoading, setAdminStatusLoading] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [adminDisplayName, setAdminDisplayName] = useState('School Administrator');
  const [showPassword, setShowPassword] = useState(false);
  const [adminSubmitting, setAdminSubmitting] = useState(false);

  useEffect(() => {
    if (initialPortal) {
      setPortal(initialPortal);
    } else if (searchParams.get('portal') === 'admin') {
      setPortal('admin');
    }
  }, [initialPortal, searchParams]);

  useEffect(() => {
    if (firebaseUser?.displayName && !displayName) {
      setDisplayName(firebaseUser.displayName);
    }
  }, [firebaseUser, displayName]);

  useEffect(() => {
    if (!loading && profile && !needsOnboarding) {
      if (profile.role === 'admin') navigate('/admin', { replace: true });
      else if (profile.role === 'teacher') navigate('/teacher', { replace: true });
      else navigate('/student', { replace: true });
    }
  }, [loading, needsOnboarding, profile, navigate]);

  useEffect(() => {
    if (portal !== 'admin') return;
    let cancelled = false;
    setAdminStatusLoading(true);
    apiFetch('/api/admin/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: AdminStatusResponse | null) => {
        if (!cancelled && data) {
          setAdminStatus(data);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setAdminStatusLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [portal]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;
    checkFirebaseDomainAuthorization(window.location.hostname)
      .then((result) => {
        if (!cancelled) {
          setDomainStatus(result);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const handleGoogleSignIn = async (method: GoogleSignInMethod = 'auto') => {
    if (googleSigningIn) return;
    setErrorText(null);
    clearAuthError();
    try {
      await signInWithGoogle(method);
    } catch (err) {
      const msg =
        err instanceof Error && err.message
          ? err.message
          : formatFirebaseAuthError(err).message;
      setErrorText(msg);
    }
  };

  const handleAdminSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorText(null);

    if (!adminEmail.trim() || !adminPassword) {
      setErrorText('Please enter your Admin email and password.');
      return;
    }

    if (adminStatus?.bootstrapRequired) {
      if (adminPassword.length < 8) {
        setErrorText('Admin password must be at least 8 characters long.');
        return;
      }
      if (adminPassword !== adminConfirmPassword) {
        setErrorText('Passwords do not match.');
        return;
      }
    }

    setAdminSubmitting(true);
    try {
      if (adminStatus?.bootstrapRequired) {
        await bootstrapAdminAccount({
          email: adminEmail.trim(),
          password: adminPassword,
          displayName: adminDisplayName.trim() || 'School Administrator',
        });
      } else {
        await loginAdminWithCredentials(adminEmail.trim(), adminPassword);
      }
      navigate('/admin', { replace: true });
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : 'Admin sign in failed.');
    } finally {
      setAdminSubmitting(false);
    }
  };

  const handleOnboardingSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setSubmitting(true);
    try {
      await completeOnboarding({
        displayName: displayName.trim() || firebaseUser?.displayName || 'Learner',
        role,
        classNumber,
        preferredLanguage,
        dailyGoalMinutes,
        specialization: role === 'teacher' ? specialization : undefined,
        inviteCode: role === 'teacher' ? inviteCode : undefined,
      });
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : 'Unable to save profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const isAuthenticated = Boolean(firebaseUser || (adminToken && profile?.role === 'admin'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50/80 via-[#FAFBFD] to-amber-50/40 flex flex-col">
      <header className="mx-auto w-full max-w-6xl px-4 py-5 flex items-center justify-between">
        <Link to="/">
          <Logo showTagline />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#0F2744]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 overflow-hidden">
          {/* Left Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0F2744] via-[#1E3A5F] to-[#1D4ED8] p-8 text-white flex flex-col justify-between">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-300">
                {SCHOOL_BRAND.fullUpperName} · {portal === 'admin' ? 'Admin Control' : 'CBSE Portal'}
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold leading-snug">
                {needsOnboarding
                  ? 'Complete your academic profile'
                  : portal === 'admin'
                    ? 'School Administrator Portal'
                    : mode === 'register'
                      ? `Create your ${SCHOOL_BRAND.name} account`
                      : `Welcome back to ${SCHOOL_BRAND.name}`}
              </h1>
              <p className="text-sm text-sky-100 leading-relaxed">
                {portal === 'admin'
                  ? 'Protected campus governance console for approving faculty registrations, issuing teacher invite codes, and overseeing CBSE Classes 1–10.'
                  : `${SCHOOL_BRAND.tagline} Access Classes 1 to 10 CBSE chapters offline, save personal revision notes, take timed quizzes, and sync seamlessly across devices.`}
              </p>
            </div>

            <div className="mt-8 space-y-3 text-xs text-sky-50">
              {portal === 'admin' ? (
                <>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0" />
                    <span>Bcrypt password verification & signed JWT session tokens</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0" />
                    <span>Approve or reject pending teacher registration requests</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0" />
                    <span>Manage faculty invite codes, announcements & moderation</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0" />
                    <span>Verified Google Sign-In for secure student & faculty accounts</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0" />
                    <span>Works offline after first chapter package download</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0" />
                    <span>Teacher access via Admin invitation code or approval queue</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-7 p-8 sm:p-10">
            {loading ? (
              <div className="py-16 text-center text-sm text-slate-500">Checking authentication status...</div>
            ) : !isAuthenticated ? (
              <div className="space-y-6">
                {/* Portal Switcher: Student & Faculty vs Admin Login */}
                <div className="grid grid-cols-2 rounded-2xl bg-sky-50/80 p-1.5 border border-sky-200/70">
                  <button
                    type="button"
                    onClick={() => {
                      setPortal('member');
                      setErrorText(null);
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                      portal === 'member'
                        ? 'bg-[#0F2744] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#0F2744]'
                    }`}
                  >
                    <GraduationCap className="h-4 w-4 shrink-0" />
                    <span>Student & Teacher</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPortal('admin');
                      setErrorText(null);
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                      portal === 'admin'
                        ? 'bg-[#0F2744] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#0F2744]'
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400" />
                    <span>Admin Login</span>
                  </button>
                </div>

                {portal === 'member' ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-[#0F2744]">
                        {mode === 'register' ? 'Get Started with Google' : 'Sign in to Continue'}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        Use your verified Google account to sign in or register as an {SCHOOL_BRAND.name} Student or Teacher.
                      </p>
                    </div>

                    {((domainStatus?.checked &&
                      !domainStatus.authorized &&
                      (!authErrorDetails || authErrorDetails.code === 'auth/unauthorized-domain')) ||
                      authErrorDetails?.code === 'auth/unauthorized-domain') && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900 space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />
                          <span>Domain Not Yet Authorized for Google Sign-In</span>
                        </div>
                        <p>
                          Add{' '}
                          <span className="font-mono font-semibold">
                            {authErrorDetails?.unauthorizedDomainHost ||
                              domainStatus?.host ||
                              (typeof window !== 'undefined' ? window.location.hostname : '')}
                          </span>{' '}
                          under Firebase Console → Authentication → Settings → Authorized domains
                          {domainStatus?.projectId ? ` (Project: ${domainStatus.projectId})` : ''}.
                        </p>
                      </div>
                    )}

                    {(errorText || authError) && (
                      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 space-y-2">
                        <p className="font-medium">{errorText || authError}</p>
                        {authErrorDetails?.code && (
                          <p className="font-mono text-[11px] text-rose-700">
                            Firebase error: {authErrorDetails.code}
                          </p>
                        )}
                        {authErrorDetails?.hint && (
                          <p className="text-xs text-rose-700">{authErrorDetails.hint}</p>
                        )}
                        {(authErrorDetails?.canRetryWithRedirect || authErrorDetails?.requiresNewTab || embedded) && (
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {authErrorDetails?.canRetryWithRedirect && !embedded && (
                              <button
                                type="button"
                                disabled={googleSigningIn}
                                onClick={() => void handleGoogleSignIn('redirect')}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-rose-300 px-3 py-1.5 text-xs font-semibold text-[#0F2744] hover:bg-sky-50 disabled:opacity-60 cursor-pointer"
                              >
                                <RefreshCw className="h-3.5 w-3.5" />
                                <span>Try Full-Page Redirect Sign-In</span>
                              </button>
                            )}
                            {(authErrorDetails?.requiresNewTab || embedded) && typeof window !== 'undefined' && (
                              <a
                                href={window.location.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F2744] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1E3A5F]"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span>Open in New Tab to Sign In</span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-2.5">
                      <button
                        type="button"
                        disabled={googleSigningIn}
                        onClick={() => void handleGoogleSignIn('auto')}
                        className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 shadow-xs hover:bg-sky-50/50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                          />
                        </svg>
                        <span>{googleSigningIn ? 'Signing in with Google...' : 'Continue with Google'}</span>
                      </button>

                      {!embedded && (
                        <button
                          type="button"
                          disabled={googleSigningIn}
                          onClick={() => void handleGoogleSignIn('redirect')}
                          className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-sky-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <span>Sign in via Full-Page Redirect (Recommended if popups are blocked)</span>
                        </button>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <button
                        type="button"
                        onClick={() => setShowHelp((v) => !v)}
                        className="inline-flex items-center gap-1 text-[#0F2744] font-medium hover:underline cursor-pointer"
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                        <span>Forgot password / account help?</span>
                      </button>
                      <Link to={mode === 'login' ? '/register' : '/login'} className="font-semibold text-[#0F2744] hover:underline">
                        {mode === 'login' ? 'New here? Register' : 'Already registered? Sign in'}
                      </Link>
                    </div>

                    {showHelp && (
                      <div className="rounded-xl bg-sky-50 border border-sky-200 p-4 text-xs text-slate-700 space-y-1.5">
                        <p className="font-semibold text-[#0F2744]">Account & Password Recovery</p>
                        <p>
                          {SCHOOL_BRAND.name} Student and Teacher accounts use verified Google Sign-In so you never lose access to offline progress. If you forgot your Google password, reset it via{' '}
                          <span className="font-semibold text-[#0F2744]">accounts.google.com/signin/recovery</span> and sign back in with the same email.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleAdminSubmit} className="space-y-5">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-2">
                        <KeyRound className="h-3.5 w-3.5" />
                        <span>
                          {adminStatus?.bootstrapRequired
                            ? 'First-Run Admin Setup'
                            : 'Authorized Admin Access'}
                        </span>
                      </div>
                      <h2 className="font-display text-2xl font-bold text-[#0F2744]">
                        {adminStatus?.bootstrapRequired
                          ? 'Initialize First Admin Account'
                          : 'Admin Sign In'}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {adminStatus?.bootstrapRequired
                          ? 'No initial Admin account is configured yet. Create your secure administrator credentials below (stored with bcrypt).'
                          : `Sign in with your ${SCHOOL_BRAND.name} administrator email and password to manage teacher approvals.`}
                      </p>
                    </div>

                    {(errorText || authError) && (
                      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 space-y-2">
                        <p className="font-medium">{errorText || authError}</p>
                        {authErrorDetails?.hint && (
                          <p className="text-xs text-rose-700">{authErrorDetails.hint}</p>
                        )}
                        {(authErrorDetails?.canRetryWithRedirect || authErrorDetails?.requiresNewTab) && (
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {authErrorDetails?.canRetryWithRedirect && !embedded && (
                              <button
                                type="button"
                                disabled={googleSigningIn}
                                onClick={() => void handleGoogleSignIn('redirect')}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-rose-300 px-3 py-1.5 text-xs font-semibold text-[#0F2744] hover:bg-sky-50 disabled:opacity-60 cursor-pointer"
                              >
                                <RefreshCw className="h-3.5 w-3.5" />
                                <span>Try Redirect Sign-In</span>
                              </button>
                            )}
                            {authErrorDetails?.requiresNewTab && typeof window !== 'undefined' && (
                              <a
                                href={window.location.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F2744] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1E3A5F]"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span>Open in New Tab</span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {adminStatusLoading ? (
                      <div className="py-6 text-xs text-slate-500">Checking administrator configuration...</div>
                    ) : (
                      <>
                        {adminStatus?.bootstrapRequired && (
                          <div>
                            <label htmlFor="admin-name" className="block text-xs font-semibold text-slate-700 mb-1">
                              Administrator Full Name
                            </label>
                            <input
                              id="admin-name"
                              type="text"
                              required
                              value={adminDisplayName}
                              onChange={(e) => setAdminDisplayName(e.target.value)}
                              placeholder="Principal / System Administrator"
                              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#0F2744] focus:outline-none"
                            />
                          </div>
                        )}

                        <div>
                          <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-700 mb-1">
                            Admin Email Address
                          </label>
                          <div className="relative">
                            <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              id="admin-email"
                              type="email"
                              required
                              autoComplete="username"
                              value={adminEmail}
                              onChange={(e) => setAdminEmail(e.target.value)}
                              placeholder="admin@indoamericanschool.edu"
                              className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-sm focus:border-[#0F2744] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-700 mb-1">
                            Admin Password
                          </label>
                          <div className="relative">
                            <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              id="admin-password"
                              type={showPassword ? 'text' : 'password'}
                              required
                              autoComplete={adminStatus?.bootstrapRequired ? 'new-password' : 'current-password'}
                              value={adminPassword}
                              onChange={(e) => setAdminPassword(e.target.value)}
                              placeholder={
                                adminStatus?.bootstrapRequired
                                  ? 'Minimum 8 characters'
                                  : 'Enter your admin password'
                              }
                              className="w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 text-sm focus:border-[#0F2744] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((v) => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        {adminStatus?.bootstrapRequired && (
                          <div>
                            <label htmlFor="admin-confirm" className="block text-xs font-semibold text-slate-700 mb-1">
                              Confirm Admin Password
                            </label>
                            <div className="relative">
                              <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                              <input
                                id="admin-confirm"
                                type={showPassword ? 'text' : 'password'}
                                required
                                autoComplete="new-password"
                                value={adminConfirmPassword}
                                onChange={(e) => setAdminConfirmPassword(e.target.value)}
                                placeholder="Re-enter password"
                                className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-sm focus:border-[#0F2744] focus:outline-none"
                              />
                            </div>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={adminSubmitting}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0F2744] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1E3A5F] disabled:opacity-60 transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="h-4 w-4 text-amber-300" />
                          <span>
                            {adminSubmitting
                              ? 'Authenticating...'
                              : adminStatus?.bootstrapRequired
                                ? 'Create Admin & Open Dashboard'
                                : 'Sign In to Admin Dashboard'}
                          </span>
                        </button>
                      </>
                    )}

                    <div className="relative flex items-center py-1">
                      <div className="flex-grow border-t border-slate-200" />
                      <span className="shrink mx-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        or
                      </span>
                      <div className="flex-grow border-t border-slate-200" />
                    </div>

                    <button
                      type="button"
                      disabled={googleSigningIn}
                      onClick={() => void handleGoogleSignIn('auto')}
                      className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-sky-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <span>
                        {googleSigningIn
                          ? 'Connecting to Google...'
                          : 'Sign in with Authorized Google Admin Account'}
                      </span>
                    </button>
                  </form>
                )}
              </div>
            ) : needsOnboarding ? (
              <form onSubmit={handleOnboardingSubmit} className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold text-[#0F2744]">Set Up Your CBSE Profile</h2>
                    <p className="text-xs text-slate-500">{firebaseUser?.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void logout()}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Switch Account
                  </button>
                </div>

                {/* Role Selector */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`rounded-xl border p-3.5 text-left transition-colors cursor-pointer ${
                      role === 'student'
                        ? 'border-[#0F2744] bg-sky-50/80'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <GraduationCap className="h-5 w-5 text-[#0F2744] mb-1.5" />
                    <p className="text-sm font-bold text-[#0F2744]">Student</p>
                    <p className="text-xs text-slate-500">CBSE Classes 1–10</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`rounded-xl border p-3.5 text-left transition-colors cursor-pointer ${
                      role === 'teacher'
                        ? 'border-[#0F2744] bg-sky-50/80'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <UserCheck className="h-5 w-5 text-amber-600 mb-1.5" />
                    <p className="text-sm font-bold text-[#0F2744]">Teacher</p>
                    <p className="text-xs text-slate-500">Courses & Grading</p>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="onb-name" className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="onb-name"
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#0F2744] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="onb-class" className="block text-xs font-semibold text-slate-700 mb-1">
                      {role === 'student' ? 'Select CBSE Class' : 'Primary Teaching Class'}
                    </label>
                    <select
                      id="onb-class"
                      value={classNumber}
                      onChange={(e) => setClassNumber(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm bg-white focus:border-[#0F2744] focus:outline-none"
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          Class {n} (CBSE)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="onb-lang" className="block text-xs font-semibold text-slate-700 mb-1">
                      Preferred Study Language
                    </label>
                    <select
                      id="onb-lang"
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value as 'English' | 'Hindi')}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm bg-white focus:border-[#0F2744] focus:outline-none"
                    >
                      <option value="English">English (with Hindi summaries)</option>
                      <option value="Hindi">Hindi Priority</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="onb-goal" className="block text-xs font-semibold text-slate-700 mb-1">
                      Daily Study Goal (Minutes)
                    </label>
                    <input
                      id="onb-goal"
                      type="number"
                      min={10}
                      max={240}
                      value={dailyGoalMinutes}
                      onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-mono tabular-nums focus:border-[#0F2744] focus:outline-none"
                    />
                  </div>
                </div>

                {role === 'teacher' && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0F2744]">
                      <ShieldCheck className="h-4 w-4 text-amber-600" />
                      <span>Faculty Verification</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="onb-spec" className="block text-xs font-semibold text-slate-700 mb-1">
                          Subject Specialization
                        </label>
                        <input
                          id="onb-spec"
                          type="text"
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          placeholder="e.g. Class 9–10 Science"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#0F2744] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="onb-code" className="block text-xs font-semibold text-slate-700 mb-1">
                          Invitation Code (Optional)
                        </label>
                        <input
                          id="onb-code"
                          type="text"
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value)}
                          placeholder="Enter code or leave blank"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-mono focus:border-[#0F2744] focus:outline-none"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">
                      With a valid Admin invitation code, your faculty account is approved immediately. Without a code, your request enters the Admin approval queue.
                    </p>
                  </div>
                )}

                {errorText && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                    {errorText}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-[#0F2744] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1E3A5F] disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? 'Creating Profile...' : 'Continue to Dashboard'}
                </button>
              </form>
            ) : profile ? (
              <div className="py-12 text-center text-sm text-slate-600">
                Redirecting to your {SCHOOL_BRAND.name} dashboard...
              </div>
            ) : (
              <div className="py-10 space-y-4 text-center">
                <p className="text-sm font-medium text-rose-700">
                  {authError || 'Could not finish loading your Indo American School profile.'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => void refreshProfile()}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0F2744] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1E3A5F] cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Retry Loading Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => void logout()}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

