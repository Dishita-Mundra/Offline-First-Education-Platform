import express, { type Request, type Response } from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  CBSE_CURRICULUM,
  getClassData,
  getSubjectById,
  searchCurriculum,
} from './src/curriculum/cbseCurriculum';
import {
  countAdmins,
  createAdminRecord,
  createAnnouncement,
  createContact,
  createInvite,
  deleteContact,
  deleteInvite,
  deleteTeacherCourse,
  findAdminByEmail,
  findTeacherByUid,
  getStorageMode,
  initDatabase,
  isEnvAdminConfigured,
  listAnnouncements,
  listContacts,
  listInvites,
  listTeacherCourses,
  listTeacherLessons,
  listTeacherQuizzes,
  listTeachers,
  redeemInvite,
  saveTeacherCourse,
  saveTeacherLesson,
  saveTeacherQuiz,
  toggleTeacherCoursePublish,
  updateTeacherDecision,
  upsertTeacherRecord,
  verifyOrSyncEnvAdmin,
} from './server/db';
import {
  checkAuthRateLimit,
  requireAdmin,
  signAdminToken,
  verifyFirebaseIdToken,
  type AuthenticatedAdminRequest,
} from './server/adminAuth';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');
const GOOGLE_BOOTSTRAPPED_ADMIN_EMAIL = 'komaljamui26@gmail.com';
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim() || null;
}

async function requireVerifiedTeacherUser(req: Request, res: Response) {
  const token = getBearerToken(req);
  if (!token) {
    res.status(401).json({ error: 'Authentication token required.' });
    return null;
  }
  const verified = await verifyFirebaseIdToken(token);
  if (!verified || !verified.emailVerified) {
    res.status(401).json({ error: 'Invalid or unverified user token.' });
    return null;
  }
  return verified;
}

async function startServer() {
  await initDatabase();

  const app = express();
  app.use(express.json({ limit: '4mb' }));

  const configuredOrigins = (process.env.FRONTEND_URL || process.env.CORS_ORIGIN || '')
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter(Boolean);
  if (process.env.APP_URL) {
    configuredOrigins.push(process.env.APP_URL.trim().replace(/\/+$/, ''));
  }

  app.use((req, res, next) => {
    // Allow Firebase Auth Google Sign-In popup window.opener communication across origins
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

    const originHeader = typeof req.headers.origin === 'string' ? req.headers.origin.replace(/\/+$/, '') : '';
    const isAllowedVercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(originHeader);
    const isLocalOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(originHeader);
    const isConfiguredOrigin = configuredOrigins.includes(originHeader);

    if (
      originHeader &&
      (isConfiguredOrigin ||
        isLocalOrigin ||
        (process.env.ALLOW_VERCEL_PREVIEWS !== 'false' && isAllowedVercelPreview))
    ) {
      res.setHeader('Access-Control-Allow-Origin', originHeader);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    }

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    return next();
  });

  // Serve local uploaded attachments safely
  app.get('/uploads/:filename', (req, res) => {
    const rawName = String(req.params.filename || '').replace(/[^a-zA-Z0-9._\-]/g, '');
    if (!rawName) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    const resolved = path.resolve(UPLOADS_DIR, rawName);
    if (!resolved.startsWith(UPLOADS_DIR + path.sep) || !fs.existsSync(resolved)) {
      return res.status(404).json({ error: 'File not found' });
    }
    return res.sendFile(resolved);
  });

  // Firebase Authorized Domain verification helper (short cache, always refreshes on cache miss for a host)
  let cachedFirebaseAuthConfig: {
    fetchedAt: number;
    projectId: string;
    authorizedDomains: string[];
  } | null = null;

  const isFirebaseHostMatch = (host: string, domains: string[]): boolean => {
    const cleanHost = host.trim().toLowerCase().replace(/\.$/, '');
    if (!cleanHost) return true;
    if (cleanHost === 'localhost' || cleanHost === '127.0.0.1') return true;
    return domains.some((rawDomain) => {
      const domain = String(rawDomain).trim().toLowerCase().replace(/\.$/, '');
      return Boolean(domain) && (cleanHost === domain || cleanHost.endsWith(`.${domain}`));
    });
  };

  app.get('/api/auth/domain-status', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    const rawHost =
      (typeof req.query.host === 'string' && req.query.host.trim()) ||
      String(req.headers['x-forwarded-host'] || req.headers.host || '');
    const host = rawHost
      .split(',')[0]
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .replace(/:\d+$/, '')
      .replace(/\.$/, '');

    try {
      const cfgPath = path.resolve(__dirname, 'firebase-applet-config.json');
      const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf-8')) as {
        apiKey?: string;
        projectId?: string;
      };
      const projectId = cfg.projectId || '';
      const apiKey = cfg.apiKey || '';

      const now = Date.now();
      const cacheExpired =
        !cachedFirebaseAuthConfig || now - cachedFirebaseAuthConfig.fetchedAt > 30 * 1000;
      const cacheMissForHost =
        Boolean(host) &&
        cachedFirebaseAuthConfig !== null &&
        !isFirebaseHostMatch(host, cachedFirebaseAuthConfig.authorizedDomains);

      if ((cacheExpired || cacheMissForHost) && apiKey) {
        const resp = await fetch(
          `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig?key=${encodeURIComponent(apiKey)}`
        );
        if (resp.ok) {
          const payload = (await resp.json()) as {
            projectId?: string;
            authorizedDomains?: string[];
          };
          cachedFirebaseAuthConfig = {
            fetchedAt: now,
            projectId: projectId || payload.projectId || '',
            authorizedDomains: Array.isArray(payload.authorizedDomains)
              ? payload.authorizedDomains.map((d) => String(d).trim().toLowerCase())
              : [],
          };
        }
      }

      if (!cachedFirebaseAuthConfig) {
        return res.json({ checked: false, authorized: true, host, projectId });
      }

      const authorized = isFirebaseHostMatch(host, cachedFirebaseAuthConfig.authorizedDomains);

      return res.json({
        checked: true,
        authorized,
        host,
        projectId: projectId || cachedFirebaseAuthConfig.projectId,
      });
    } catch {
      return res.json({ checked: false, authorized: true, host });
    }
  });

  // Health check
  app.get('/api/health', async (_req, res) => {
    const adminCount = await countAdmins();
    res.json({
      status: 'ok',
      app: 'Indo American School',
      classesSupported: 10,
      storageMode: getStorageMode(),
      adminConfigured: adminCount > 0,
      aiConfigured: Boolean(getGeminiClient()),
      cloudinaryConfigured: Boolean(
        process.env.CLOUDINARY_CLOUD_NAME &&
          process.env.CLOUDINARY_API_KEY &&
          process.env.CLOUDINARY_API_SECRET
      ),
    });
  });

  // ---------------- Admin Authentication & Bootstrap APIs ----------------

  app.get('/api/admin/status', async (_req, res) => {
    const adminCount = await countAdmins();
    const envConfigured = isEnvAdminConfigured();
    res.json({
      configured: adminCount > 0,
      bootstrapRequired: adminCount === 0 && !envConfigured,
      envConfigured,
      storageMode: getStorageMode(),
    });
  });

  // Atomic one-time first-run admin setup when ADMIN_EMAIL / ADMIN_PASSWORD are not pre-configured
  app.post('/api/admin/bootstrap', async (req, res) => {
    const clientIp = req.ip || 'unknown';
    if (!checkAuthRateLimit(`bootstrap:${clientIp}`, 8)) {
      return res.status(429).json({ error: 'Too many setup attempts. Please wait a few minutes.' });
    }

    if (isEnvAdminConfigured()) {
      return res.status(403).json({
        error: 'Initial Admin account is already managed by server environment variables.',
      });
    }

    const existingCount = await countAdmins();
    if (existingCount > 0) {
      return res.status(403).json({
        error: 'An Admin account already exists. Please sign in using Admin Login.',
      });
    }

    const body = req.body ?? {};
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const displayName =
      typeof body.displayName === 'string' && body.displayName.trim().length >= 2
        ? body.displayName.trim().slice(0, 80)
        : 'Indo American School Administrator';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
      return res.status(400).json({ error: 'Please enter a valid Admin email address.' });
    }
    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({ error: 'Admin password must be 8 to 128 characters long.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date().toISOString();
    const admin = await createAdminRecord({
      uid: `admin_boot_${Date.now()}`,
      email,
      displayName,
      passwordHash,
      role: 'admin',
      source: 'bootstrap',
      createdAt: now,
      updatedAt: now,
    });

    const token = signAdminToken(admin);
    return res.status(201).json({
      token,
      admin: {
        uid: admin.uid,
        email: admin.email,
        displayName: admin.displayName,
        role: 'admin',
      },
    });
  });

  // Admin Login (Email + Password verified via bcrypt, with env-admin sync fallback)
  app.post('/api/admin/login', async (req, res) => {
    try {
      const body = req.body ?? {};
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      const password = typeof body.password === 'string' ? body.password : '';

      const rateKey = `login:${req.ip || 'unknown'}:${email.slice(0, 64)}`;
      if (!checkAuthRateLimit(rateKey, 12)) {
        return res.status(429).json({ error: 'Too many login attempts. Please wait a few minutes.' });
      }

      if (!email || !password || email.length > 160 || password.length > 128) {
        return res.status(400).json({ error: 'Please provide both Admin email and password.' });
      }

      let admin = await findAdminByEmail(email);
      let passwordMatches = admin ? await bcrypt.compare(password, admin.passwordHash) : false;

      if (!admin || !passwordMatches) {
        const syncedEnvAdmin = await verifyOrSyncEnvAdmin(email, password);
        if (syncedEnvAdmin) {
          admin = syncedEnvAdmin;
          passwordMatches = true;
        }
      }

      if (!admin || !passwordMatches) {
        return res.status(401).json({ error: 'Invalid Admin email or password.' });
      }

      const token = signAdminToken(admin);
      return res.json({
        token,
        admin: {
          uid: admin.uid,
          email: admin.email,
          displayName: admin.displayName,
          role: 'admin',
        },
      });
    } catch (err) {
      console.error('Admin login error:', err);
      return res.status(500).json({ error: 'Unable to complete Admin authentication right now.' });
    }
  });

  // Optional bridge for the bootstrapped Google Admin account to also operate backend Admin APIs
  app.post('/api/admin/google-session', async (req, res) => {
    const idToken = getBearerToken(req) || (typeof req.body?.idToken === 'string' ? req.body.idToken : null);
    if (!idToken) {
      return res.status(401).json({ error: 'Firebase ID token required.' });
    }
    const verified = await verifyFirebaseIdToken(idToken);
    if (!verified || !verified.emailVerified || verified.email !== GOOGLE_BOOTSTRAPPED_ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Google account is not authorized as Admin.' });
    }

    let admin = await findAdminByEmail(verified.email);
    if (!admin) {
      const now = new Date().toISOString();
      const randomSecret = await bcrypt.hash(`${verified.uid}_${Date.now()}_${Math.random()}`, 10);
      admin = await createAdminRecord({
        uid: verified.uid,
        email: verified.email,
        displayName: verified.displayName || 'Indo American School Admin',
        passwordHash: randomSecret,
        role: 'admin',
        source: 'bootstrap',
        createdAt: now,
        updatedAt: now,
      });
    }

    const token = signAdminToken(admin);
    return res.json({
      token,
      admin: {
        uid: admin.uid,
        email: admin.email,
        displayName: admin.displayName,
        role: 'admin',
      },
    });
  });

  app.get('/api/admin/me', requireAdmin, (req: AuthenticatedAdminRequest, res) => {
    res.json({ admin: req.admin });
  });

  // ---------------- Protected Admin Dashboard APIs ----------------

  app.get('/api/admin/overview', requireAdmin, async (_req, res) => {
    const [teachers, invites, courses, contacts, announcements] = await Promise.all([
      listTeachers(),
      listInvites(),
      listTeacherCourses(),
      listContacts(),
      listAnnouncements(),
    ]);
    res.json({
      storageMode: getStorageMode(),
      pendingTeachersCount: teachers.filter((t) => t.teacherStatus === 'pending').length,
      approvedTeachersCount: teachers.filter((t) => t.teacherStatus === 'approved').length,
      rejectedTeachersCount: teachers.filter((t) => t.teacherStatus === 'rejected').length,
      invitesCount: invites.length,
      coursesCount: courses.length,
      contactsCount: contacts.length,
      announcementsCount: announcements.length,
    });
  });

  app.get('/api/admin/teachers', requireAdmin, async (_req, res) => {
    const teachers = await listTeachers();
    res.json({ teachers });
  });

  app.patch('/api/admin/teachers/:uid/status', requireAdmin, async (req: AuthenticatedAdminRequest, res) => {
    const uid = String(req.params.uid || '').replace(/[^a-zA-Z0-9_\-]/g, '');
    const status = req.body?.status;

    if (!uid) {
      return res.status(400).json({ error: 'Valid teacher ID is required.' });
    }
    if (status !== 'approved' && status !== 'rejected') {
      return res.status(400).json({ error: 'Status must be either approved or rejected.' });
    }

    const updated = await updateTeacherDecision(uid, status, req.admin!.email);
    if (!updated) {
      return res.status(404).json({ error: 'Teacher registration not found.' });
    }
    return res.json({ teacher: updated });
  });

  app.get('/api/admin/invites', requireAdmin, async (_req, res) => {
    const invites = await listInvites();
    res.json({ invites });
  });

  app.post('/api/admin/invites', requireAdmin, async (req: AuthenticatedAdminRequest, res) => {
    const raw = typeof req.body?.code === 'string' ? req.body.code.trim().replace(/[^a-zA-Z0-9_-]/g, '') : '';
    const code = raw.length >= 6 && raw.length <= 40 ? raw : `IASTEACH_${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    try {
      const invite = await createInvite(code, req.admin!.uid);
      return res.status(201).json({ invite });
    } catch (err) {
      return res.status(409).json({
        error: err instanceof Error ? err.message : 'Unable to create invitation code.',
      });
    }
  });

  app.delete('/api/admin/invites/:code', requireAdmin, async (req, res) => {
    const code = String(req.params.code || '').replace(/[^a-zA-Z0-9_-]/g, '');
    if (!code) return res.status(400).json({ error: 'Invalid code.' });
    await deleteInvite(code);
    return res.json({ deleted: true });
  });

  app.get('/api/admin/courses', requireAdmin, async (_req, res) => {
    const courses = await listTeacherCourses();
    res.json({ courses });
  });

  app.patch('/api/admin/courses/:id/toggle', requireAdmin, async (req, res) => {
    const id = String(req.params.id || '').replace(/[^a-zA-Z0-9_-]/g, '');
    const published = Boolean(req.body?.published);
    const updated = await toggleTeacherCoursePublish(id, published);
    if (!updated) return res.status(404).json({ error: 'Course not found.' });
    return res.json({ course: updated });
  });

  app.delete('/api/admin/courses/:id', requireAdmin, async (req, res) => {
    const id = String(req.params.id || '').replace(/[^a-zA-Z0-9_-]/g, '');
    await deleteTeacherCourse(id);
    return res.json({ deleted: true });
  });

  app.post('/api/admin/announcements', requireAdmin, async (req: AuthenticatedAdminRequest, res) => {
    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    if (title.length < 2 || title.length > 160 || message.length < 2 || message.length > 600) {
      return res.status(400).json({ error: 'Announcement title and message are required.' });
    }
    const announcement = await createAnnouncement({
      title,
      message,
      createdBy: req.admin!.email,
    });
    return res.status(201).json({ announcement });
  });

  app.get('/api/announcements', async (_req, res) => {
    const announcements = await listAnnouncements();
    res.json({ announcements });
  });

  app.get('/api/admin/contacts', requireAdmin, async (_req, res) => {
    const contacts = await listContacts();
    res.json({ contacts });
  });

  app.delete('/api/admin/contacts/:id', requireAdmin, async (req, res) => {
    const id = String(req.params.id || '').replace(/[^a-zA-Z0-9_-]/g, '');
    await deleteContact(id);
    return res.json({ deleted: true });
  });

  app.post('/api/contact', async (req, res) => {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    if (name.length < 2 || !email.includes('@') || message.length < 5) {
      return res.status(400).json({ error: 'Valid name, email, and message are required.' });
    }
    const contact = await createContact({ name: name.slice(0, 100), email: email.slice(0, 160), message: message.slice(0, 2000) });
    return res.status(201).json({ contact });
  });

  // ---------------- Teacher Registration Sync & Approval Status APIs ----------------

  app.post('/api/teachers/sync', async (req, res) => {
    const verified = await requireVerifiedTeacherUser(req, res);
    if (!verified) return;

    const body = req.body ?? {};
    const displayName =
      typeof body.displayName === 'string' && body.displayName.trim().length > 0
        ? body.displayName.trim().slice(0, 100)
        : verified.displayName || 'Faculty Member';
    const classNumber = Number.isInteger(Number(body.classNumber))
      ? Math.min(10, Math.max(1, Number(body.classNumber)))
      : 8;
    const preferredLanguage = body.preferredLanguage === 'Hindi' ? 'Hindi' : 'English';
    const specialization = typeof body.specialization === 'string' ? body.specialization.slice(0, 120) : undefined;
    const inviteCodeUsed = typeof body.inviteCodeUsed === 'string' ? body.inviteCodeUsed.trim().slice(0, 40) : undefined;

    let initialStatus: 'pending' | 'approved' = body.firestoreApproved === true ? 'approved' : 'pending';
    if (inviteCodeUsed) {
      const redeemed = await redeemInvite(inviteCodeUsed, verified.uid);
      if (redeemed) initialStatus = 'approved';
    }

    const teacher = await upsertTeacherRecord({
      uid: verified.uid,
      email: verified.email,
      displayName,
      classNumber,
      preferredLanguage,
      specialization,
      inviteCodeUsed,
      initialStatus,
    });

    return res.json({ teacher });
  });

  app.get('/api/teachers/status', async (req, res) => {
    const verified = await requireVerifiedTeacherUser(req, res);
    if (!verified) return;

    const teacher = await findTeacherByUid(verified.uid);
    if (!teacher) {
      return res.json({ found: false, teacherStatus: null });
    }
    return res.json({ found: true, teacherStatus: teacher.teacherStatus, teacher });
  });

  // Teacher Studio backend content APIs (gated by verified Firebase user + approved teacherStatus)
  app.get('/api/teacher/content', async (req, res) => {
    const verified = await requireVerifiedTeacherUser(req, res);
    if (!verified) return;
    const teacher = await findTeacherByUid(verified.uid);
    if (!teacher || teacher.teacherStatus !== 'approved') {
      return res.status(403).json({ error: 'Approved teacher status required.' });
    }
    const [courses, lessons, quizzes] = await Promise.all([
      listTeacherCourses(verified.uid),
      listTeacherLessons(verified.uid),
      listTeacherQuizzes(verified.uid),
    ]);
    return res.json({ courses, lessons, quizzes });
  });

  app.post('/api/teacher/courses', async (req, res) => {
    const verified = await requireVerifiedTeacherUser(req, res);
    if (!verified) return;
    const teacher = await findTeacherByUid(verified.uid);
    if (!teacher || teacher.teacherStatus !== 'approved') {
      return res.status(403).json({ error: 'Approved teacher status required.' });
    }
    const body = req.body ?? {};
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const classNumber = Number(body.classNumber);
    const subjectId = typeof body.subjectId === 'string' ? body.subjectId.trim() : '';
    const subjectName = typeof body.subjectName === 'string' ? body.subjectName.trim() : '';
    if (!title || !Number.isInteger(classNumber) || classNumber < 1 || classNumber > 10 || !subjectId || !subjectName) {
      return res.status(400).json({ error: 'Invalid course payload.' });
    }
    const now = new Date().toISOString();
    const course = await saveTeacherCourse({
      id: typeof body.id === 'string' && body.id ? body.id : `course_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title: title.slice(0, 160),
      description: description.slice(0, 1500),
      classNumber,
      subjectId: subjectId.slice(0, 80),
      subjectName: subjectName.slice(0, 80),
      teacherId: verified.uid,
      teacherName: teacher.displayName,
      published: true,
      createdAt: now,
      updatedAt: now,
    });
    return res.status(201).json({ course });
  });

  app.patch('/api/teacher/courses/:id/toggle', async (req, res) => {
    const verified = await requireVerifiedTeacherUser(req, res);
    if (!verified) return;
    const id = String(req.params.id || '').replace(/[^a-zA-Z0-9_-]/g, '');
    const updated = await toggleTeacherCoursePublish(id, Boolean(req.body?.published), verified.uid);
    if (!updated) return res.status(404).json({ error: 'Course not found.' });
    return res.json({ course: updated });
  });

  app.delete('/api/teacher/courses/:id', async (req, res) => {
    const verified = await requireVerifiedTeacherUser(req, res);
    if (!verified) return;
    const id = String(req.params.id || '').replace(/[^a-zA-Z0-9_-]/g, '');
    await deleteTeacherCourse(id, verified.uid);
    return res.json({ deleted: true });
  });

  app.post('/api/teacher/lessons', async (req, res) => {
    const verified = await requireVerifiedTeacherUser(req, res);
    if (!verified) return;
    const teacher = await findTeacherByUid(verified.uid);
    if (!teacher || teacher.teacherStatus !== 'approved') {
      return res.status(403).json({ error: 'Approved teacher status required.' });
    }
    const body = req.body ?? {};
    if (typeof body.courseId !== 'string' || typeof body.title !== 'string' || typeof body.content !== 'string') {
      return res.status(400).json({ error: 'Invalid lesson payload.' });
    }
    const now = new Date().toISOString();
    const lesson = await saveTeacherLesson({
      id: typeof body.id === 'string' && body.id ? body.id : `lesson_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      courseId: body.courseId,
      title: body.title.trim().slice(0, 180),
      chapterTitle: typeof body.chapterTitle === 'string' ? body.chapterTitle.trim().slice(0, 180) : body.title.trim(),
      content: body.content.trim().slice(0, 15000),
      objectives: Array.isArray(body.objectives) ? body.objectives.map(String).slice(0, 15) : undefined,
      videoUrl: typeof body.videoUrl === 'string' ? body.videoUrl.slice(0, 500) : undefined,
      resourceUrl: typeof body.resourceUrl === 'string' ? body.resourceUrl.slice(0, 500) : undefined,
      classNumber: Number(body.classNumber) || teacher.classNumber,
      subjectName: typeof body.subjectName === 'string' ? body.subjectName.slice(0, 80) : 'CBSE',
      teacherId: verified.uid,
      createdAt: now,
      updatedAt: now,
    });
    return res.status(201).json({ lesson });
  });

  app.post('/api/teacher/quizzes', async (req, res) => {
    const verified = await requireVerifiedTeacherUser(req, res);
    if (!verified) return;
    const teacher = await findTeacherByUid(verified.uid);
    if (!teacher || teacher.teacherStatus !== 'approved') {
      return res.status(403).json({ error: 'Approved teacher status required.' });
    }
    const body = req.body ?? {};
    if (typeof body.title !== 'string' || !Array.isArray(body.questions) || body.questions.length === 0) {
      return res.status(400).json({ error: 'Invalid quiz payload.' });
    }
    const now = new Date().toISOString();
    const quiz = await saveTeacherQuiz({
      id: typeof body.id === 'string' && body.id ? body.id : `quiz_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title: body.title.trim().slice(0, 180),
      classNumber: Number(body.classNumber) || teacher.classNumber,
      subjectName: typeof body.subjectName === 'string' ? body.subjectName.slice(0, 80) : 'CBSE',
      timeLimitMinutes: Number(body.timeLimitMinutes) || 15,
      passingScore: Number(body.passingScore) || 60,
      questions: body.questions.slice(0, 30),
      teacherId: verified.uid,
      published: true,
      createdAt: now,
      updatedAt: now,
    });
    return res.status(201).json({ quiz });
  });

  // CBSE Classes & Subjects REST APIs
  app.get('/api/classes', (_req, res) => {
    const summary = CBSE_CURRICULUM.map((c) => ({
      classNumber: c.classNumber,
      label: c.label,
      stage: c.stage,
      subjectCount: c.subjects.length,
      chapterCount: c.subjects.reduce((acc, s) => acc + s.chapters.length, 0),
    }));
    res.json({ board: 'CBSE', classes: summary });
  });

  app.get('/api/classes/:classNum/subjects', (req, res) => {
    const num = Number(req.params.classNum);
    if (!Number.isInteger(num) || num < 1 || num > 10) {
      return res.status(400).json({ error: 'Class number must be between 1 and 10.' });
    }
    const cls = getClassData(num);
    if (!cls) return res.status(404).json({ error: 'Class not found.' });
    return res.json({ classNumber: num, subjects: cls.subjects });
  });

  app.get('/api/subjects/:subjectId/chapters', (req, res) => {
    const subject = getSubjectById(String(req.params.subjectId));
    if (!subject) return res.status(404).json({ error: 'Subject not found.' });
    return res.json({ subject });
  });

  app.get('/api/search', (req, res) => {
    const q = String(req.query.q || '').trim();
    const classNum = req.query.classNumber ? Number(req.query.classNumber) : undefined;
    if (!q) return res.json({ results: [] });
    return res.json({ results: searchCurriculum(q, classNum) });
  });

  // AI Doubt Assistant status
  app.get('/api/ai/status', (_req, res) => {
    res.json({ available: Boolean(getGeminiClient()) });
  });

  // AI Doubt Assistant endpoint (Server-side @google/genai)
  app.post('/api/ai/doubt', async (req, res) => {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        available: false,
        error:
          'AI Doubt Assistant is currently unavailable because GEMINI_API_KEY is not configured on the server.',
      });
    }

    const { question, classNumber, subjectName, chapterTitle, language } = req.body ?? {};
    if (typeof question !== 'string' || question.trim().length < 3 || question.trim().length > 1000) {
      return res.status(400).json({ error: 'Please enter a clear question (3 to 1000 characters).' });
    }

    const safeClass = Number.isInteger(Number(classNumber)) ? Number(classNumber) : 6;
    const safeSubject = typeof subjectName === 'string' ? subjectName.slice(0, 80) : 'General CBSE';
    const safeChapter = typeof chapterTitle === 'string' ? chapterTitle.slice(0, 140) : '';
    const safeLang = language === 'Hindi' ? 'Hindi (with clear English terms where helpful)' : 'English';

    const systemInstruction = `You are Indo American School Doubt Mentor, a warm, encouraging CBSE school tutor in India.
Tailor your explanation strictly for a Class ${safeClass} CBSE student studying ${safeSubject}${safeChapter ? ` (Chapter: ${safeChapter})` : ''}.
Respond in ${safeLang}.
Structure every reply cleanly:
1. Direct Concept Summary (2–3 simple sentences appropriate for Class ${safeClass}).
2. Step-by-Step Explanation (numbered steps, clear formulas/examples).
3. Quick Memory Tip or Practice Check question at the end.
Keep tone patient, accurate, and concise.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: question.trim(),
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const answer = response.text?.trim();
      if (!answer) {
        return res.status(502).json({ error: 'No response generated. Please rephrase your question.' });
      }
      return res.json({ available: true, answer });
    } catch (err) {
      console.error('Gemini AI Doubt error:', err);
      return res.status(502).json({
        available: true,
        error:
          err instanceof Error
            ? `Unable to answer right now: ${err.message}`
            : 'Unable to reach AI Doubt Assistant right now.',
      });
    }
  });

  // Safe file upload endpoint (local dev storage or Cloudinary if configured)
  app.post('/api/upload', async (req, res) => {
    const body = req.body ?? {};
    const rawFilename = body.filename ?? body.fileName;
    const rawBase64 = body.contentBase64 ?? body.base64Data;
    const mimeType = body.mimeType;
    if (typeof rawFilename !== 'string' || typeof rawBase64 !== 'string') {
      return res.status(400).json({ error: 'Invalid upload payload.' });
    }

    const allowedExt = new Set(['.pdf', '.txt', '.png', '.jpg', '.jpeg', '.html']);
    const cleanBase = path.basename(rawFilename).replace(/[^a-zA-Z0-9._\-]/g, '_');
    const ext = path.extname(cleanBase).toLowerCase();
    if (!allowedExt.has(ext)) {
      return res.status(400).json({ error: 'Allowed file types: PDF, PNG, JPG, TXT, HTML.' });
    }

    const base64Body = rawBase64.includes(',') ? rawBase64.split(',')[1] : rawBase64;
    const buffer = Buffer.from(base64Body, 'base64');
    if (buffer.length === 0 || buffer.length > 2 * 1024 * 1024) {
      return res.status(400).json({ error: 'File must be between 1 byte and 2 MB.' });
    }

    const resolvedMime =
      typeof mimeType === 'string' && mimeType.trim()
        ? mimeType.trim()
        : ext === '.pdf'
          ? 'application/pdf'
          : ext === '.png'
            ? 'image/png'
            : ext === '.jpg' || ext === '.jpeg'
              ? 'image/jpeg'
              : ext === '.html'
                ? 'text/html'
                : 'text/plain';

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const cloudApiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const cloudApiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
    const hasCloudinary =
      Boolean(cloudName && cloudApiKey && cloudApiSecret) &&
      !cloudName!.startsWith('MY_') &&
      !cloudApiKey!.startsWith('MY_') &&
      !cloudApiSecret!.startsWith('MY_');

    if (hasCloudinary) {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const folder = 'indo_american_school';
        const sigPayload = `folder=${folder}&timestamp=${timestamp}${cloudApiSecret}`;
        const signature = crypto.createHash('sha1').update(sigPayload).digest('hex');

        const form = new URLSearchParams();
        form.set('file', `data:${resolvedMime};base64,${base64Body}`);
        form.set('api_key', cloudApiKey!);
        form.set('timestamp', String(timestamp));
        form.set('folder', folder);
        form.set('signature', signature);

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName!)}/auto/upload`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: form.toString(),
          }
        );

        if (cloudRes.ok) {
          const cloudData = (await cloudRes.json()) as { secure_url?: string };
          if (cloudData.secure_url) {
            return res.json({
              url: cloudData.secure_url,
              filename: cleanBase,
              fileName: cleanBase,
              sizeBytes: buffer.length,
              mimeType: resolvedMime,
              storage: 'cloudinary',
            });
          }
        } else {
          const errText = await cloudRes.text().catch(() => '');
          console.warn('Cloudinary upload failed, falling back to local storage:', cloudRes.status, errText);
        }
      } catch (cloudErr) {
        console.warn('Cloudinary upload error, falling back to local storage:', cloudErr);
      }
    }

    const safeName = `${Date.now()}_${cleanBase}`;
    const targetPath = path.resolve(UPLOADS_DIR, safeName);
    if (!targetPath.startsWith(UPLOADS_DIR + path.sep)) {
      return res.status(400).json({ error: 'Invalid upload path.' });
    }

    fs.writeFileSync(targetPath, buffer);
    const publicBase = (process.env.PUBLIC_BACKEND_URL || process.env.RENDER_EXTERNAL_URL || '')
      .trim()
      .replace(/\/+$/, '');
    const relativePath = `/uploads/${safeName}`;
    return res.json({
      url: publicBase ? `${publicBase}${relativePath}` : relativePath,
      filename: cleanBase,
      fileName: cleanBase,
      sizeBytes: buffer.length,
      mimeType: resolvedMime,
      storage: 'local',
    });
  });

  // Vite dev middleware or production static build
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false, ws: false },
      appType: 'spa',
    });

    // HMR is disabled in this runtime; swap Vite's WebSocket transport for a no-op transport
    // so neither WebSocket connection errors nor SendBeforeConnectError can occur.
    app.get('/@vite/client', async (_req, res, next) => {
      try {
        const result = await vite.transformRequest('/@vite/client');
        if (!result?.code) return next();
        let patched = result.code;
        const startMarker = 'const transport = normalizeModuleRunnerTransport(';
        const endMarker = 'let willUnload = false;';
        const startIdx = patched.indexOf(startMarker);
        const endIdx = startIdx !== -1 ? patched.indexOf(endMarker, startIdx) : -1;
        if (startIdx !== -1 && endIdx !== -1) {
          const noopTransport =
            'const transport = { async connect() {}, async disconnect() {}, async send() {}, async invoke() { return undefined; } };';
          patched = patched.slice(0, startIdx) + noopTransport + patched.slice(endIdx);
        }
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        return res.send(patched);
      } catch {
        return next();
      }
    });

    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    const distIndex = path.resolve(distDir, 'index.html');
    if (fs.existsSync(distIndex)) {
      app.use(express.static(distDir));
      app.get('*', (_req, res) => {
        res.sendFile(distIndex);
      });
    } else {
      app.get('/', (_req, res) => {
        res.json({
          status: 'ok',
          service: 'Indo American School API',
          storageMode: getStorageMode(),
          healthCheck: '/api/health',
        });
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Indo American School server running on http://0.0.0.0:${PORT} (storage: ${getStorageMode()})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Indo American School server:', err);
  process.exit(1);
});

