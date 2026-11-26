import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import mongoose, { Schema, type Model } from 'mongoose';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const LOCAL_DB_FILE = path.resolve(DATA_DIR, 'ias-db.json');

export type TeacherApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface AdminRecord {
  uid: string;
  email: string;
  displayName: string;
  passwordHash: string;
  role: 'admin';
  source: 'env' | 'bootstrap';
  createdAt: string;
  updatedAt: string;
}

export interface TeacherRecord {
  uid: string;
  email: string;
  displayName: string;
  classNumber: number;
  preferredLanguage: 'English' | 'Hindi';
  specialization?: string;
  teacherStatus: TeacherApprovalStatus;
  inviteCodeUsed?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InviteRecord {
  code: string;
  createdBy: string;
  used: boolean;
  usedBy?: string;
  createdAt: string;
}

export interface AnnouncementRecord {
  id: string;
  title: string;
  message: string;
  createdBy: string;
  createdAt: string;
}

export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface BackendCourseRecord {
  id: string;
  title: string;
  description: string;
  classNumber: number;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendLessonRecord {
  id: string;
  courseId: string;
  title: string;
  chapterTitle: string;
  content: string;
  objectives?: string[];
  videoUrl?: string;
  resourceUrl?: string;
  classNumber: number;
  subjectName: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendQuizRecord {
  id: string;
  title: string;
  classNumber: number;
  subjectName: string;
  timeLimitMinutes: number;
  passingScore: number;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
  teacherId: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LocalDbShape {
  admins: AdminRecord[];
  teachers: TeacherRecord[];
  invites: InviteRecord[];
  announcements: AnnouncementRecord[];
  contacts: ContactRecord[];
  courses: BackendCourseRecord[];
  lessons: BackendLessonRecord[];
  quizzes: BackendQuizRecord[];
}

// ---------------- Mongoose Schemas ----------------

const AdminSchema = new Schema<AdminRecord>(
  {
    uid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    displayName: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin'], default: 'admin', required: true },
    source: { type: String, enum: ['env', 'bootstrap'], default: 'env', required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  { versionKey: false }
);

const TeacherSchema = new Schema<TeacherRecord>(
  {
    uid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    displayName: { type: String, required: true, trim: true },
    classNumber: { type: Number, required: true, min: 1, max: 10 },
    preferredLanguage: { type: String, enum: ['English', 'Hindi'], default: 'English' },
    specialization: { type: String, trim: true },
    teacherStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    inviteCodeUsed: { type: String, trim: true },
    reviewedBy: { type: String, trim: true },
    reviewedAt: { type: String },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  { versionKey: false }
);

const InviteSchema = new Schema<InviteRecord>(
  {
    code: { type: String, required: true, unique: true, index: true },
    createdBy: { type: String, required: true },
    used: { type: Boolean, default: false },
    usedBy: { type: String },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);

const AnnouncementSchema = new Schema<AnnouncementRecord>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);

const ContactSchema = new Schema<ContactRecord>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);

const CourseSchema = new Schema<BackendCourseRecord>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    classNumber: { type: Number, required: true, min: 1, max: 10 },
    subjectId: { type: String, required: true },
    subjectName: { type: String, required: true },
    teacherId: { type: String, required: true, index: true },
    teacherName: { type: String, required: true },
    published: { type: Boolean, default: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  { versionKey: false }
);

const LessonSchema = new Schema<BackendLessonRecord>(
  {
    id: { type: String, required: true, unique: true, index: true },
    courseId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    chapterTitle: { type: String, required: true },
    content: { type: String, required: true },
    objectives: { type: [String], default: undefined },
    videoUrl: { type: String },
    resourceUrl: { type: String },
    classNumber: { type: Number, required: true, min: 1, max: 10 },
    subjectName: { type: String, required: true },
    teacherId: { type: String, required: true, index: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  { versionKey: false }
);

const QuizQuestionSchema = new Schema(
  {
    id: { type: String, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctIndex: { type: Number, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false }
);

const QuizSchema = new Schema<BackendQuizRecord>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    classNumber: { type: Number, required: true, min: 1, max: 10 },
    subjectName: { type: String, required: true },
    timeLimitMinutes: { type: Number, required: true },
    passingScore: { type: Number, required: true },
    questions: { type: [QuizQuestionSchema], required: true },
    teacherId: { type: String, required: true, index: true },
    published: { type: Boolean, default: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  { versionKey: false }
);

const AdminModel: Model<AdminRecord> =
  mongoose.models.Admin || mongoose.model<AdminRecord>('Admin', AdminSchema);
const TeacherModel: Model<TeacherRecord> =
  mongoose.models.Teacher || mongoose.model<TeacherRecord>('Teacher', TeacherSchema);
const InviteModel: Model<InviteRecord> =
  mongoose.models.Invite || mongoose.model<InviteRecord>('Invite', InviteSchema);
const AnnouncementModel: Model<AnnouncementRecord> =
  mongoose.models.Announcement || mongoose.model<AnnouncementRecord>('Announcement', AnnouncementSchema);
const ContactModel: Model<ContactRecord> =
  mongoose.models.Contact || mongoose.model<ContactRecord>('Contact', ContactSchema);
const CourseModel: Model<BackendCourseRecord> =
  mongoose.models.Course || mongoose.model<BackendCourseRecord>('Course', CourseSchema);
const LessonModel: Model<BackendLessonRecord> =
  mongoose.models.Lesson || mongoose.model<BackendLessonRecord>('Lesson', LessonSchema);
const QuizModel: Model<BackendQuizRecord> =
  mongoose.models.Quiz || mongoose.model<BackendQuizRecord>('Quiz', QuizSchema);

// ---------------- Persistence Mode ----------------

let mongoActive = false;

function readLocalDb(): LocalDbShape {
  try {
    if (!fs.existsSync(LOCAL_DB_FILE)) {
      return {
        admins: [],
        teachers: [],
        invites: [],
        announcements: [],
        contacts: [],
        courses: [],
        lessons: [],
        quizzes: [],
      };
    }
    const raw = fs.readFileSync(LOCAL_DB_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<LocalDbShape>;
    return {
      admins: Array.isArray(parsed.admins) ? parsed.admins : [],
      teachers: Array.isArray(parsed.teachers) ? parsed.teachers : [],
      invites: Array.isArray(parsed.invites) ? parsed.invites : [],
      announcements: Array.isArray(parsed.announcements) ? parsed.announcements : [],
      contacts: Array.isArray(parsed.contacts) ? parsed.contacts : [],
      courses: Array.isArray(parsed.courses) ? parsed.courses : [],
      lessons: Array.isArray(parsed.lessons) ? parsed.lessons : [],
      quizzes: Array.isArray(parsed.quizzes) ? parsed.quizzes : [],
    };
  } catch {
    return {
      admins: [],
      teachers: [],
      invites: [],
      announcements: [],
      contacts: [],
      courses: [],
      lessons: [],
      quizzes: [],
    };
  }
}

function writeLocalDb(data: LocalDbShape): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmpFile = `${LOCAL_DB_FILE}.tmp.${process.pid}`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), { mode: 0o600 });
  fs.renameSync(tmpFile, LOCAL_DB_FILE);
}

export function getStorageMode(): 'mongodb' | 'local-store' {
  return mongoActive ? 'mongodb' : 'local-store';
}

function getEnvAdminCredentials(): { email: string; password: string } | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return null;
  if (email.startsWith('MY_') || password.startsWith('MY_')) return null;
  if (!email.includes('@') || password.trim().length === 0 || password.length < 6) {
    return null;
  }
  return { email, password };
}

function constantTimePasswordEquals(a: string, b: string): boolean {
  const digestA = crypto.createHash('sha256').update(a, 'utf8').digest();
  const digestB = crypto.createHash('sha256').update(b, 'utf8').digest();
  return crypto.timingSafeEqual(digestA, digestB);
}

export function isEnvAdminConfigured(): boolean {
  return Boolean(getEnvAdminCredentials());
}

export async function initDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI?.trim();
  if (uri && !uri.startsWith('MY_')) {
    try {
      const pathMatch = uri.match(/^mongodb(?:\+srv)?:\/\/[^/]+\/([^?]*)/i);
      const hasExplicitDb = Boolean(pathMatch?.[1]?.trim());
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
        ...(hasExplicitDb ? {} : { dbName: 'indo_american_school' }),
      });
      mongoActive = true;
      console.log('Connected to MongoDB for Indo American School.');
    } catch (err) {
      mongoActive = false;
      console.warn(
        'MongoDB connection failed; falling back to local server store:',
        err instanceof Error ? err.message : err
      );
    }
  } else {
    mongoActive = false;
  }

  await seedEnvAdminIfConfigured();
}

async function seedEnvAdminIfConfigured(): Promise<AdminRecord | null> {
  const creds = getEnvAdminCredentials();
  if (!creds) return null;
  const { email, password } = creds;
  const now = new Date().toISOString();

  const existing = await findAdminByEmail(email);
  if (existing) {
    const matches = await bcrypt.compare(password, existing.passwordHash);
    if (matches) return existing;
    const newHash = await bcrypt.hash(password, 12);
    await updateAdminPasswordHash(existing.uid, newHash);
    return { ...existing, passwordHash: newHash, updatedAt: now, source: 'env' };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  return createAdminRecord({
    uid: `admin_env_${Date.now()}`,
    email,
    displayName: 'Indo American School Administrator',
    passwordHash,
    role: 'admin',
    source: 'env',
    createdAt: now,
    updatedAt: now,
  });
}

export async function verifyOrSyncEnvAdmin(
  email: string,
  password: string
): Promise<AdminRecord | null> {
  const creds = getEnvAdminCredentials();
  if (!creds) return null;
  if (email.trim().toLowerCase() !== creds.email) return null;
  if (!constantTimePasswordEquals(password, creds.password)) return null;

  return seedEnvAdminIfConfigured();
}

// ---------------- Repository Methods ----------------

export async function countAdmins(): Promise<number> {
  if (mongoActive) {
    return AdminModel.countDocuments().exec();
  }
  return readLocalDb().admins.length;
}

export async function findAdminByEmail(email: string): Promise<AdminRecord | null> {
  const normalized = email.trim().toLowerCase();
  if (mongoActive) {
    const doc = await AdminModel.findOne({ email: normalized }).lean<AdminRecord>().exec();
    return doc ?? null;
  }
  const db = readLocalDb();
  return db.admins.find((a) => a.email.toLowerCase() === normalized) ?? null;
}

export async function findAdminByUid(uid: string): Promise<AdminRecord | null> {
  if (mongoActive) {
    const doc = await AdminModel.findOne({ uid }).lean<AdminRecord>().exec();
    return doc ?? null;
  }
  const db = readLocalDb();
  return db.admins.find((a) => a.uid === uid) ?? null;
}

export async function createAdminRecord(record: AdminRecord): Promise<AdminRecord> {
  if (mongoActive) {
    const created = await AdminModel.create(record);
    return created.toObject();
  }
  const db = readLocalDb();
  db.admins.push(record);
  writeLocalDb(db);
  return record;
}

async function updateAdminPasswordHash(uid: string, passwordHash: string): Promise<void> {
  const updatedAt = new Date().toISOString();
  if (mongoActive) {
    await AdminModel.updateOne({ uid }, { $set: { passwordHash, updatedAt, source: 'env' } }).exec();
    return;
  }
  const db = readLocalDb();
  const target = db.admins.find((a) => a.uid === uid);
  if (target) {
    target.passwordHash = passwordHash;
    target.updatedAt = updatedAt;
    target.source = 'env';
    writeLocalDb(db);
  }
}

export async function upsertTeacherRecord(input: {
  uid: string;
  email: string;
  displayName: string;
  classNumber: number;
  preferredLanguage: 'English' | 'Hindi';
  specialization?: string;
  inviteCodeUsed?: string;
  initialStatus?: TeacherApprovalStatus;
}): Promise<TeacherRecord> {
  const now = new Date().toISOString();
  const cleanEmail = input.email.trim().toLowerCase();

  if (mongoActive) {
    const existing = await TeacherModel.findOne({ uid: input.uid }).lean<TeacherRecord>().exec();
    if (existing) {
      // Never allow teacher self-sync to overwrite an admin-set approved/rejected decision
      const nextStatus: TeacherApprovalStatus =
        existing.teacherStatus === 'approved' || existing.teacherStatus === 'rejected'
          ? existing.teacherStatus
          : input.initialStatus === 'approved'
            ? 'approved'
            : existing.teacherStatus;

      const updated = await TeacherModel.findOneAndUpdate(
        { uid: input.uid },
        {
          $set: {
            email: cleanEmail,
            displayName: input.displayName.trim(),
            classNumber: input.classNumber,
            preferredLanguage: input.preferredLanguage,
            ...(input.specialization ? { specialization: input.specialization.trim() } : {}),
            ...(input.inviteCodeUsed ? { inviteCodeUsed: input.inviteCodeUsed.trim() } : {}),
            teacherStatus: nextStatus,
            updatedAt: now,
          },
        },
        { new: true }
      )
        .lean<TeacherRecord>()
        .exec();
      return updated!;
    }

    const created = await TeacherModel.create({
      uid: input.uid,
      email: cleanEmail,
      displayName: input.displayName.trim(),
      classNumber: input.classNumber,
      preferredLanguage: input.preferredLanguage,
      specialization: input.specialization?.trim(),
      inviteCodeUsed: input.inviteCodeUsed?.trim(),
      teacherStatus: input.initialStatus === 'approved' ? 'approved' : 'pending',
      createdAt: now,
      updatedAt: now,
    });
    return created.toObject();
  }

  const db = readLocalDb();
  const idx = db.teachers.findIndex((t) => t.uid === input.uid);
  if (idx >= 0) {
    const existing = db.teachers[idx];
    const nextStatus: TeacherApprovalStatus =
      existing.teacherStatus === 'approved' || existing.teacherStatus === 'rejected'
        ? existing.teacherStatus
        : input.initialStatus === 'approved'
          ? 'approved'
          : existing.teacherStatus;

    const updated: TeacherRecord = {
      ...existing,
      email: cleanEmail,
      displayName: input.displayName.trim(),
      classNumber: input.classNumber,
      preferredLanguage: input.preferredLanguage,
      specialization: input.specialization?.trim() ?? existing.specialization,
      inviteCodeUsed: input.inviteCodeUsed?.trim() ?? existing.inviteCodeUsed,
      teacherStatus: nextStatus,
      updatedAt: now,
    };
    db.teachers[idx] = updated;
    writeLocalDb(db);
    return updated;
  }

  const created: TeacherRecord = {
    uid: input.uid,
    email: cleanEmail,
    displayName: input.displayName.trim(),
    classNumber: input.classNumber,
    preferredLanguage: input.preferredLanguage,
    specialization: input.specialization?.trim(),
    inviteCodeUsed: input.inviteCodeUsed?.trim(),
    teacherStatus: input.initialStatus === 'approved' ? 'approved' : 'pending',
    createdAt: now,
    updatedAt: now,
  };
  db.teachers.push(created);
  writeLocalDb(db);
  return created;
}

export async function findTeacherByUid(uid: string): Promise<TeacherRecord | null> {
  if (mongoActive) {
    const doc = await TeacherModel.findOne({ uid }).lean<TeacherRecord>().exec();
    return doc ?? null;
  }
  return readLocalDb().teachers.find((t) => t.uid === uid) ?? null;
}

export async function listTeachers(): Promise<TeacherRecord[]> {
  if (mongoActive) {
    return TeacherModel.find().sort({ createdAt: -1 }).lean<TeacherRecord[]>().exec();
  }
  return [...readLocalDb().teachers].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateTeacherDecision(
  uid: string,
  status: 'approved' | 'rejected',
  adminUid: string
): Promise<TeacherRecord | null> {
  const now = new Date().toISOString();
  if (mongoActive) {
    const updated = await TeacherModel.findOneAndUpdate(
      { uid },
      {
        $set: {
          teacherStatus: status,
          reviewedBy: adminUid,
          reviewedAt: now,
          updatedAt: now,
        },
      },
      { new: true }
    )
      .lean<TeacherRecord>()
      .exec();
    return updated ?? null;
  }

  const db = readLocalDb();
  const target = db.teachers.find((t) => t.uid === uid);
  if (!target) return null;
  target.teacherStatus = status;
  target.reviewedBy = adminUid;
  target.reviewedAt = now;
  target.updatedAt = now;
  writeLocalDb(db);
  return target;
}

export async function listInvites(): Promise<InviteRecord[]> {
  if (mongoActive) {
    return InviteModel.find().sort({ createdAt: -1 }).lean<InviteRecord[]>().exec();
  }
  return [...readLocalDb().invites].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createInvite(code: string, createdBy: string): Promise<InviteRecord> {
  const record: InviteRecord = {
    code,
    createdBy,
    used: false,
    createdAt: new Date().toISOString(),
  };
  if (mongoActive) {
    const existing = await InviteModel.findOne({ code }).lean<InviteRecord>().exec();
    if (existing) throw new Error('Invitation code already exists.');
    const created = await InviteModel.create(record);
    return created.toObject();
  }
  const db = readLocalDb();
  if (db.invites.some((i) => i.code === code)) {
    throw new Error('Invitation code already exists.');
  }
  db.invites.push(record);
  writeLocalDb(db);
  return record;
}

export async function redeemInvite(code: string, uid: string): Promise<boolean> {
  if (mongoActive) {
    const res = await InviteModel.findOneAndUpdate(
      { code, used: false },
      { $set: { used: true, usedBy: uid } },
      { new: true }
    ).exec();
    return Boolean(res);
  }
  const db = readLocalDb();
  const inv = db.invites.find((i) => i.code === code && !i.used);
  if (!inv) return false;
  inv.used = true;
  inv.usedBy = uid;
  writeLocalDb(db);
  return true;
}

export async function deleteInvite(code: string): Promise<void> {
  if (mongoActive) {
    await InviteModel.deleteOne({ code }).exec();
    return;
  }
  const db = readLocalDb();
  db.invites = db.invites.filter((i) => i.code !== code);
  writeLocalDb(db);
}

export async function listAnnouncements(): Promise<AnnouncementRecord[]> {
  if (mongoActive) {
    return AnnouncementModel.find().sort({ createdAt: -1 }).limit(25).lean<AnnouncementRecord[]>().exec();
  }
  return [...readLocalDb().announcements].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 25);
}

export async function createAnnouncement(input: {
  title: string;
  message: string;
  createdBy: string;
}): Promise<AnnouncementRecord> {
  const record: AnnouncementRecord = {
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    title: input.title,
    message: input.message,
    createdBy: input.createdBy,
    createdAt: new Date().toISOString(),
  };
  if (mongoActive) {
    const created = await AnnouncementModel.create(record);
    return created.toObject();
  }
  const db = readLocalDb();
  db.announcements.push(record);
  writeLocalDb(db);
  return record;
}

export async function listContacts(): Promise<ContactRecord[]> {
  if (mongoActive) {
    return ContactModel.find().sort({ createdAt: -1 }).lean<ContactRecord[]>().exec();
  }
  return [...readLocalDb().contacts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createContact(input: { name: string; email: string; message: string }): Promise<ContactRecord> {
  const record: ContactRecord = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: input.name,
    email: input.email,
    message: input.message,
    createdAt: new Date().toISOString(),
  };
  if (mongoActive) {
    const created = await ContactModel.create(record);
    return created.toObject();
  }
  const db = readLocalDb();
  db.contacts.push(record);
  writeLocalDb(db);
  return record;
}

export async function deleteContact(id: string): Promise<void> {
  if (mongoActive) {
    await ContactModel.deleteOne({ id }).exec();
    return;
  }
  const db = readLocalDb();
  db.contacts = db.contacts.filter((c) => c.id !== id);
  writeLocalDb(db);
}

// Teacher content fallback persistence (used when teacher was approved via Admin backend API)
export async function listTeacherCourses(teacherId?: string): Promise<BackendCourseRecord[]> {
  if (mongoActive) {
    const filter = teacherId ? { teacherId } : {};
    return CourseModel.find(filter).sort({ createdAt: -1 }).lean<BackendCourseRecord[]>().exec();
  }
  const all = readLocalDb().courses;
  return teacherId ? all.filter((c) => c.teacherId === teacherId) : all;
}

export async function saveTeacherCourse(record: BackendCourseRecord): Promise<BackendCourseRecord> {
  if (mongoActive) {
    const created = await CourseModel.create(record);
    return created.toObject();
  }
  const db = readLocalDb();
  db.courses.push(record);
  writeLocalDb(db);
  return record;
}

export async function toggleTeacherCoursePublish(
  id: string,
  published: boolean,
  teacherId?: string
): Promise<BackendCourseRecord | null> {
  const updatedAt = new Date().toISOString();
  if (mongoActive) {
    const filter = teacherId ? { id, teacherId } : { id };
    const doc = await CourseModel.findOneAndUpdate(filter, { $set: { published, updatedAt } }, { new: true })
      .lean<BackendCourseRecord>()
      .exec();
    return doc ?? null;
  }
  const db = readLocalDb();
  const target = db.courses.find((c) => c.id === id && (!teacherId || c.teacherId === teacherId));
  if (!target) return null;
  target.published = published;
  target.updatedAt = updatedAt;
  writeLocalDb(db);
  return target;
}

export async function deleteTeacherCourse(id: string, teacherId?: string): Promise<void> {
  if (mongoActive) {
    const filter = teacherId ? { id, teacherId } : { id };
    await CourseModel.deleteOne(filter).exec();
    return;
  }
  const db = readLocalDb();
  db.courses = db.courses.filter((c) => !(c.id === id && (!teacherId || c.teacherId === teacherId)));
  writeLocalDb(db);
}

export async function listTeacherLessons(teacherId?: string): Promise<BackendLessonRecord[]> {
  if (mongoActive) {
    const filter = teacherId ? { teacherId } : {};
    return LessonModel.find(filter).sort({ createdAt: -1 }).lean<BackendLessonRecord[]>().exec();
  }
  const all = readLocalDb().lessons;
  return teacherId ? all.filter((l) => l.teacherId === teacherId) : all;
}

export async function saveTeacherLesson(record: BackendLessonRecord): Promise<BackendLessonRecord> {
  if (mongoActive) {
    const created = await LessonModel.create(record);
    return created.toObject();
  }
  const db = readLocalDb();
  db.lessons.push(record);
  writeLocalDb(db);
  return record;
}

export async function listTeacherQuizzes(teacherId?: string): Promise<BackendQuizRecord[]> {
  if (mongoActive) {
    const filter = teacherId ? { teacherId } : {};
    return QuizModel.find(filter).sort({ createdAt: -1 }).lean<BackendQuizRecord[]>().exec();
  }
  const all = readLocalDb().quizzes;
  return teacherId ? all.filter((q) => q.teacherId === teacherId) : all;
}

export async function saveTeacherQuiz(record: BackendQuizRecord): Promise<BackendQuizRecord> {
  if (mongoActive) {
    const created = await QuizModel.create(record);
    return created.toObject();
  }
  const db = readLocalDb();
  db.quizzes.push(record);
  writeLocalDb(db);
  return record;
}
