export type UserRole = 'student' | 'teacher' | 'admin';
export type TeacherStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface PracticeQA {
  question: string;
  answer: string;
}

export interface CBSEChapter {
  id: string;
  classNumber: number;
  subjectId: string;
  subjectName: string;
  chapterNumber: number;
  title: string;
  topics: string[];
  summary: string;
  objectives: string[];
  studyNotes: string[];
  revisionPoints: string[];
  hindiSummary?: string;
  practiceQuestions: PracticeQA[];
  quizQuestions: QuizQuestion[];
  estimatedMinutes: number;
  conceptDiagramType: 'math-numberline' | 'science-cycle' | 'grammar-tree' | 'history-timeline' | 'cs-flow' | 'geometry-shapes';
}

export interface CBSESubject {
  id: string;
  classNumber: number;
  name: string;
  hindiName?: string;
  category: 'Languages' | 'Mathematics' | 'Science' | 'Social Science' | 'Technology' | 'EVS';
  accentTint: 'lavender' | 'blue' | 'mint' | 'peach';
  description: string;
  chapters: CBSEChapter[];
}

export interface CBSEClassData {
  classNumber: number;
  label: string;
  stage: 'Primary (Classes 1–5)' | 'Middle (Classes 6–8)' | 'Secondary (Classes 9–10)';
  subjects: CBSESubject[];
}

export interface SampleAssignment {
  id: string;
  title: string;
  description: string;
  classNumber: number;
  subjectName: string;
  dueDate: string;
  maxMarks: number;
  teacherId: string;
  teacherName: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  teacherStatus: TeacherStatus;
  classNumber: number;
  board: 'CBSE';
  preferredLanguage: 'English' | 'Hindi';
  dailyGoalMinutes?: number;
  specialization?: string;
  inviteCodeUsed?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface StudentProfile {
  uid: string;
  displayName: string;
  classNumber: number;
  xp: number;
  streakDays: number;
  lessonsCompleted: number;
  avgQuizScore: number;
  badges?: string[];
  updatedAt?: unknown;
}

export interface CourseRecord {
  id: string;
  title: string;
  description: string;
  classNumber: number;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  published: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface LessonRecord {
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
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface QuizRecord {
  id: string;
  title: string;
  classNumber: number;
  subjectName: string;
  chapterTitle?: string;
  timeLimitMinutes: number;
  passingScore: number;
  questions: QuizQuestion[];
  teacherId: string;
  published: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface QuizAttemptRecord {
  id: string;
  operationId: string;
  userId: string;
  quizId: string;
  quizTitle: string;
  classNumber: number;
  subjectName: string;
  chapterId?: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  attemptedOffline: boolean;
  createdAt?: unknown;
  localTimestamp?: number;
  syncStatus?: 'pending' | 'synced' | 'failed';
}

export interface LessonProgressRecord {
  id: string;
  userId: string;
  lessonId: string;
  classNumber: number;
  subjectName: string;
  chapterTitle?: string;
  completed: boolean;
  timeSpentMinutes: number;
  updatedAt?: unknown;
  localTimestamp?: number;
  syncStatus?: 'pending' | 'synced' | 'failed';
}

export interface AssignmentRecord {
  id: string;
  title: string;
  description: string;
  classNumber: number;
  subjectName: string;
  dueDate: string;
  maxMarks: number;
  teacherId: string;
  teacherName: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface SubmissionRecord {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  teacherId?: string;
  userId: string;
  studentName: string;
  classNumber: number;
  answerText: string;
  attachmentName?: string;
  attachmentUrl?: string;
  status: 'submitted' | 'graded';
  marks?: number;
  feedback?: string;
  gradedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface PersonalNoteRecord {
  id: string;
  userId: string;
  classNumber: number;
  subjectName: string;
  chapterTitle?: string;
  title: string;
  content: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  localTimestamp?: number;
  syncStatus?: 'pending' | 'synced' | 'failed';
}

export interface BookmarkRecord {
  id: string;
  userId: string;
  lessonId: string;
  title: string;
  classNumber: number;
  subjectName: string;
  createdAt?: unknown;
}

export interface DiscussionRecord {
  id: string;
  userId: string;
  authorName: string;
  authorRole: UserRole;
  classNumber: number;
  subjectName: string;
  title: string;
  body: string;
  resolved: boolean;
  reported: boolean;
  replyCount: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface DiscussionReplyRecord {
  id: string;
  discussionId: string;
  userId: string;
  authorName: string;
  authorRole: UserRole;
  body: string;
  isTeacherAnswer: boolean;
  createdAt?: unknown;
}

export interface CertificateRecord {
  id: string;
  userId: string;
  studentName: string;
  classNumber: number;
  subjectName: string;
  courseTitle: string;
  scorePercent: number;
  issuedAt?: unknown;
}

export interface ParentReportRecord {
  id: string;
  studentUid: string;
  studentName: string;
  classNumber: number;
  lessonsCompleted: number;
  avgQuizScore: number;
  streakDays: number;
  xp: number;
  active: boolean;
  createdAt?: unknown;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'announcement' | 'quiz' | 'assignment' | 'feedback' | 'sync';
  createdAt?: unknown;
}
