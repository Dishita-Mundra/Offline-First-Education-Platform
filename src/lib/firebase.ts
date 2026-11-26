import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
} from 'firebase/auth';
import { doc, getDocFromServer, getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const FIREBASE_PROJECT_ID = firebaseConfig.projectId;
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const authPersistenceReady: Promise<void> =
  typeof window !== 'undefined'
    ? setPersistence(auth, browserLocalPersistence).catch(() => undefined)
    : Promise.resolve();

export function isEmbeddedFrame(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function isStandalonePwa(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)')?.matches === true ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

export function isStandaloneOrMobile(): boolean {
  if (typeof window === 'undefined') return false;
  const mobileUa = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent || ''
  );
  return isStandalonePwa() || mobileUa;
}

export interface FirebaseDomainCheckResult {
  checked: boolean;
  authorized: boolean;
  host: string;
  projectId: string;
}

export function normalizeHostname(rawHost: string): string {
  return rawHost
    .split(',')[0]
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/:\d+$/, '')
    .replace(/\.$/, '');
}

export function isFirebaseHostAuthorized(host: string, authorizedDomains: string[]): boolean {
  const normalizedHost = normalizeHostname(host);
  if (!normalizedHost) return true;
  if (normalizedHost === 'localhost' || normalizedHost === '127.0.0.1') return true;
  return authorizedDomains.some((rawDomain) => {
    const domain = normalizeHostname(String(rawDomain));
    if (!domain) return false;
    return normalizedHost === domain || normalizedHost.endsWith(`.${domain}`);
  });
}

export async function checkFirebaseDomainAuthorization(
  hostname?: string
): Promise<FirebaseDomainCheckResult> {
  const rawHost =
    hostname || (typeof window !== 'undefined' ? window.location.hostname : '');
  const host = normalizeHostname(rawHost);
  const projectId = firebaseConfig.projectId;
  const apiKey = firebaseConfig.apiKey;

  if (!host || !apiKey) {
    return { checked: false, authorized: true, host, projectId };
  }

  try {
    const resp = await fetch(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig?key=${encodeURIComponent(apiKey)}`,
      { cache: 'no-store' }
    );
    if (!resp.ok) {
      return { checked: false, authorized: true, host, projectId };
    }
    const payload = (await resp.json()) as {
      authorizedDomains?: string[];
    };
    if (!Array.isArray(payload.authorizedDomains)) {
      return { checked: false, authorized: true, host, projectId };
    }

    const authorized = isFirebaseHostAuthorized(host, payload.authorizedDomains);
    return { checked: true, authorized, host, projectId };
  } catch {
    return { checked: false, authorized: true, host, projectId };
  }
}

export interface FormattedFirebaseAuthError {
  code: string;
  message: string;
  hint?: string;
  isCancelled?: boolean;
  canRetryWithRedirect?: boolean;
  requiresNewTab?: boolean;
  unauthorizedDomainHost?: string;
}

export function formatFirebaseAuthError(err: unknown): FormattedFirebaseAuthError {
  const rawCode =
    typeof err === 'object' && err !== null && 'code' in err && typeof (err as { code?: unknown }).code === 'string'
      ? (err as { code: string }).code
      : '';
  const rawMessage = err instanceof Error ? err.message : String(err || '');
  const embedded = isEmbeddedFrame();
  const host = typeof window !== 'undefined' ? window.location.hostname : '';

  switch (rawCode) {
    case 'auth/popup-blocked':
      return {
        code: rawCode,
        message: 'Your browser blocked the Google Sign-In popup window.',
        hint: embedded
          ? 'Embedded preview frames sometimes block popups. Open this app in a new tab or allow popups for this site.'
          : 'Allow popups for this site or use full-page Redirect Sign-In below.',
        canRetryWithRedirect: !embedded,
        requiresNewTab: embedded,
      };
    case 'auth/popup-closed-by-user':
      return {
        code: rawCode,
        message: 'Google Sign-In window was closed before signing in. Please try again to continue.',
        isCancelled: true,
        canRetryWithRedirect: !embedded,
      };
    case 'auth/cancelled-popup-request':
      return {
        code: rawCode,
        message: 'A previous Google Sign-In request was interrupted. Please click once and wait for Google to finish.',
        isCancelled: true,
      };
    case 'auth/unauthorized-domain':
      return {
        code: rawCode,
        message: `Domain "${host || 'current host'}" is not authorized for Firebase Google Sign-In.`,
        hint: `Add "${host}" in Firebase Console → Authentication → Settings → Authorized domains (Project: ${firebaseConfig.projectId}).`,
        unauthorizedDomainHost: host,
      };
    case 'auth/operation-not-allowed':
      return {
        code: rawCode,
        message: 'Google Sign-In is currently disabled in Firebase Authentication settings.',
        hint: 'Enable the Google provider in Firebase Console → Authentication → Sign-in method.',
      };
    case 'auth/network-request-failed':
      return {
        code: rawCode,
        message: 'Network error while connecting to Google Sign-In. Please check your internet connection and retry.',
      };
    case 'auth/user-disabled':
      return {
        code: rawCode,
        message: 'This Google account has been disabled by an administrator.',
      };
    case 'auth/account-exists-with-different-credential':
      return {
        code: rawCode,
        message: 'An account already exists with this email using a different sign-in provider.',
      };
    case 'auth/web-storage-unsupported':
      return {
        code: rawCode,
        message: 'Browser cookies or web storage are disabled. Please enable site data/cookies to sign in with Google.',
      };
    case 'auth/redirect-cancelled-by-user':
      return {
        code: rawCode,
        message: 'Google Redirect Sign-In was cancelled before completion.',
        isCancelled: true,
      };
    case 'auth/redirect-operation-pending':
      return {
        code: rawCode,
        message: 'A Google Sign-In redirect is already in progress. Please wait or refresh the page.',
      };
    case 'auth/internal-error':
      return {
        code: rawCode,
        message: `Google authentication encountered an internal error (${rawCode}).${rawMessage ? ` ${rawMessage}` : ''}`,
        hint: 'Please try again, or use Full-Page Redirect Sign-In below.',
        canRetryWithRedirect: !embedded,
      };
    default: {
      const codeSuffix = rawCode ? ` (${rawCode})` : '';
      return {
        code: rawCode || 'auth/unknown',
        message: rawMessage
          ? `${rawMessage}${rawCode && !rawMessage.includes(rawCode) ? ` (${rawCode})` : ''}`
          : `Unable to sign in with Google right now${codeSuffix}. Please try again.`,
        canRetryWithRedirect: !embedded,
      };
    }
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      email: auth.currentUser?.email ?? null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId ?? null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) ?? [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Firestore client appears offline or unconfigured.');
    }
    return false;
  }
}

void testConnection();
