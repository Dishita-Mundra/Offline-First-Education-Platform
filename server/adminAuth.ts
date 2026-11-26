import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { findAdminByUid, type AdminRecord } from './db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RUNTIME_JWT_SECRET = crypto.randomBytes(32).toString('hex');

function getJwtSecret(): string {
  const configured =
    process.env.ADMIN_JWT_SECRET?.trim() || process.env.JWT_SECRET?.trim();
  if (configured && configured.length >= 16 && !configured.startsWith('MY_')) {
    return configured;
  }
  return RUNTIME_JWT_SECRET;
}

let cachedFirebaseApiKey: string | null = null;

function getFirebaseApiKey(): string | null {
  if (cachedFirebaseApiKey) return cachedFirebaseApiKey;
  try {
    const configPath = path.resolve(__dirname, '..', 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8')) as { apiKey?: string };
      if (parsed.apiKey) {
        cachedFirebaseApiKey = parsed.apiKey;
        return cachedFirebaseApiKey;
      }
    }
  } catch {
    // ignore missing config
  }
  return null;
}

export interface AdminJwtPayload {
  sub: string;
  email: string;
  displayName: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

export interface AuthenticatedAdminRequest extends Request {
  admin?: {
    uid: string;
    email: string;
    displayName: string;
    role: 'admin';
  };
}

export function signAdminToken(admin: AdminRecord): string {
  const payload: AdminJwtPayload = {
    sub: admin.uid,
    email: admin.email,
    displayName: admin.displayName,
    role: 'admin',
  };
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '8h' });
}

export async function requireAdmin(
  req: AuthenticatedAdminRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Admin authentication required.' });
    return;
  }

  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) {
    res.status(401).json({ error: 'Invalid authorization header.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AdminJwtPayload;
    if (!decoded || decoded.role !== 'admin' || typeof decoded.sub !== 'string') {
      res.status(403).json({ error: 'Admin access required.' });
      return;
    }

    const adminRecord = await findAdminByUid(decoded.sub);
    if (!adminRecord || adminRecord.role !== 'admin') {
      res.status(401).json({ error: 'Admin session is no longer valid.' });
      return;
    }

    req.admin = {
      uid: adminRecord.uid,
      email: adminRecord.email,
      displayName: adminRecord.displayName,
      role: 'admin',
    };
    next();
  } catch {
    res.status(401).json({ error: 'Admin session expired or invalid. Please sign in again.' });
  }
}

export interface VerifiedFirebaseUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName?: string;
}

export async function verifyFirebaseIdToken(idToken: string): Promise<VerifiedFirebaseUser | null> {
  const apiKey = getFirebaseApiKey();
  if (!apiKey || !idToken || idToken.length < 20) return null;

  try {
    const resp = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!resp.ok) return null;
    const data = (await resp.json()) as {
      users?: Array<{
        localId?: string;
        email?: string;
        emailVerified?: boolean;
        displayName?: string;
      }>;
    };
    const user = data.users?.[0];
    if (!user?.localId || !user?.email) return null;
    return {
      uid: user.localId,
      email: user.email.toLowerCase(),
      emailVerified: Boolean(user.emailVerified),
      displayName: user.displayName,
    };
  } catch {
    return null;
  }
}

// Simple in-memory rate limiter for auth endpoints
const attempts = new Map<string, { count: number; resetAt: number }>();

export function checkAuthRateLimit(key: string, maxAttempts = 12, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxAttempts) {
    return false;
  }
  entry.count += 1;
  return true;
}
