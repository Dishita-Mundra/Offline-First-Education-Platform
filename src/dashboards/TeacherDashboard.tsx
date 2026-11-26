import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Download,
  FileCheck2,
  LayoutDashboard,
  MessageSquare,
  Plus,
  RefreshCw,
  ShieldAlert,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { DashboardLayout, type NavItem } from '../components/DashboardLayout';
import { DoubtForumPanel } from '../components/DoubtForumPanel';
import { useAuth } from '../context/AuthContext';
import { getSubjectsForClass } from '../curriculum/cbseCurriculum';
import { apiFetch, resolveAssetUrl } from '../lib/api';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import type {
  AssignmentRecord,
  CourseRecord,
  LessonRecord,
  QuizQuestion,
  QuizRecord,
  StudentProfile,
  SubmissionRecord,
} from '../types/curriculum';

export default function TeacherDashboard() {
  const { profile, firebaseUser, refreshProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [lessons, setLessons] = useState<LessonRecord[]>([]);
  const [quizzes, setQuizzes] = useState<QuizRecord[]>([]);
  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);

  // Course form
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseClass, setCourseClass] = useState(profile?.classNumber ?? 10);
  const [courseSubjectId, setCourseSubjectId] = useState('');

  // Lesson form
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonChapter, setLessonChapter] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonObjectives, setLessonObjectives] = useState('');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonResourceUrl, setLessonResourceUrl] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  // Quiz builder
  const [quizTitle, setQuizTitle] = useState('');
  const [quizClass, setQuizClass] = useState(profile?.classNumber ?? 10);
  const [quizSubject, setQuizSubject] = useState('Mathematics');
  const [quizTime, setQuizTime] = useState(15);
  const [qPrompt, setQPrompt] = useState('');
  const [qOpt0, setQOpt0] = useState('');
  const [qOpt1, setQOpt1] = useState('');
  const [qOpt2, setQOpt2] = useState('');
  const [qOpt3, setQOpt3] = useState('');
  const [qCorrect, setQCorrect] = useState(0);
  const [qExplanation, setQExplanation] = useState('');
  const [draftQuestions, setDraftQuestions] = useState<QuizQuestion[]>([]);

  // Assignment form
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignClass, setAssignClass] = useState(profile?.classNumber ?? 10);
  const [assignSubject, setAssignSubject] = useState('Science');
  const [assignDue, setAssignDue] = useState('2026-12-20');
  const [assignMarks, setAssignMarks] = useState(30);

  // Grading state
  const [gradeInputs, setGradeInputs] = useState<Record<string, { marks: number; feedback: string }>>({});
  const [studentClassFilter, setStudentClassFilter] = useState<number>(0);

  const getTeacherAuthHeaders = useCallback(async (): Promise<HeadersInit | null> => {
    if (!firebaseUser) return null;
    const token = await firebaseUser.getIdToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, [firebaseUser]);

  const loadTeacherData = useCallback(async () => {
    if (!profile || profile.teacherStatus !== 'approved') return;
    if (!navigator.onLine) return;

    let fsCourses: CourseRecord[] = [];
    let fsLessons: LessonRecord[] = [];
    let fsQuizzes: QuizRecord[] = [];

    try {
      const [cSnap, lSnap, qSnap, aSnap, sSnap, stSnap] = await Promise.all([
        getDocs(query(collection(db, 'courses'), where('teacherId', '==', profile.uid))),
        getDocs(query(collection(db, 'lessons'), where('classNumber', '>=', 1))),
        getDocs(query(collection(db, 'quizzes'), where('teacherId', '==', profile.uid))),
        getDocs(query(collection(db, 'assignments'), where('classNumber', '>=', 1))),
        getDocs(query(collection(db, 'submissions'), where('teacherId', '==', profile.uid))),
        getDocs(query(collection(db, 'studentProfiles'), where('classNumber', '>=', 1))),
      ]);
      fsCourses = cSnap.docs.map((d) => d.data() as CourseRecord);
      fsLessons = lSnap.docs.map((d) => d.data() as LessonRecord).filter((l) => l.teacherId === profile.uid);
      fsQuizzes = qSnap.docs.map((d) => d.data() as QuizRecord);
      setAssignments(aSnap.docs.map((d) => d.data() as AssignmentRecord).filter((a) => a.teacherId === profile.uid));
      setSubmissions(sSnap.docs.map((d) => d.data() as SubmissionRecord));
      setStudents(stSnap.docs.map((d) => d.data() as StudentProfile));
    } catch (err) {
      console.warn('Teacher Firestore load issue:', err);
    }

    try {
      const headers = await getTeacherAuthHeaders();
      if (headers) {
        const res = await apiFetch('/api/teacher/content', { headers });
        if (res.ok) {
          const data = (await res.json()) as {
            courses?: CourseRecord[];
            lessons?: LessonRecord[];
            quizzes?: QuizRecord[];
          };
          fsCourses = Array.from(
            new Map([...(data.courses ?? []), ...fsCourses].map((c) => [c.id, c])).values()
          );
          fsLessons = Array.from(
            new Map([...(data.lessons ?? []), ...fsLessons].map((l) => [l.id, l])).values()
          );
          fsQuizzes = Array.from(
            new Map([...(data.quizzes ?? []), ...fsQuizzes].map((q) => [q.id, q])).values()
          );
        }
      }
    } catch {
      // ignore fallback errors
    }

    setCourses(fsCourses);
    if (fsCourses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(fsCourses[0].id);
    }
    setLessons(fsLessons);
    setQuizzes(fsQuizzes);
  }, [profile, selectedCourseId, getTeacherAuthHeaders]);

  useEffect(() => {
    const subs = getSubjectsForClass(courseClass);
    if (subs[0]) setCourseSubjectId(subs[0].id);
  }, [courseClass]);

  useEffect(() => {
    const subs = getSubjectsForClass(quizClass);
    if (subs[0]) setQuizSubject(subs[0].name);
  }, [quizClass]);

  useEffect(() => {
    const subs = getSubjectsForClass(assignClass);
    if (subs[0]) setAssignSubject(subs[0].name);
  }, [assignClass]);

  useEffect(() => {
    void loadTeacherData();
  }, [loadTeacherData]);

  // Pending / Rejected Teacher Gate
  if (profile && profile.role === 'teacher' && profile.teacherStatus !== 'approved') {
    return (
      <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center p-4">
        <div className="max-w-lg w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center space-y-5">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            {profile.teacherStatus === 'rejected' ? <ShieldAlert className="h-7 w-7" /> : <Clock className="h-7 w-7" />}
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            {profile.teacherStatus === 'rejected' ? 'Teacher Request Declined' : 'Teacher Approval Pending'}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {profile.teacherStatus === 'rejected'
              ? 'Your teacher verification request was not approved by the administrator. Please contact support for assistance.'
              : 'Your teacher account has been registered and is waiting in the Admin approval queue. Once approved, you can publish CBSE courses, quizzes, and grade assignments.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => void refreshProfile()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0F2744] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1E3A5F] cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Check Approval Status</span>
            </button>
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateCourse = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const subjects = getSubjectsForClass(courseClass);
    const sub = subjects.find((s) => s.id === courseSubjectId) ?? subjects[0];
    if (!sub) return;
    const id = `course_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    try {
      await setDoc(doc(db, 'courses', id), {
        id,
        title: courseTitle.trim(),
        description: courseDesc.trim(),
        classNumber: courseClass,
        subjectId: sub.id,
        subjectName: sub.name,
        teacherId: profile.uid,
        teacherName: profile.displayName,
        published: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setCourseTitle('');
      setCourseDesc('');
      await loadTeacherData();
    } catch (err) {
      const headers = await getTeacherAuthHeaders();
      if (headers) {
        const res = await apiFetch('/api/teacher/courses', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            id,
            title: courseTitle.trim(),
            description: courseDesc.trim(),
            classNumber: courseClass,
            subjectId: sub.id,
            subjectName: sub.name,
          }),
        });
        if (res.ok) {
          setCourseTitle('');
          setCourseDesc('');
          await loadTeacherData();
          return;
        }
      }
      handleFirestoreError(err, OperationType.CREATE, `courses/${id}`);
    }
  };

  const handleTogglePublishCourse = async (course: CourseRecord) => {
    try {
      await updateDoc(doc(db, 'courses', course.id), {
        published: !course.published,
        updatedAt: serverTimestamp(),
      });
      await loadTeacherData();
    } catch (err) {
      const headers = await getTeacherAuthHeaders();
      if (headers) {
        const res = await apiFetch(`/api/teacher/courses/${encodeURIComponent(course.id)}/toggle`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ published: !course.published }),
        });
        if (res.ok) {
          await loadTeacherData();
          return;
        }
      }
      handleFirestoreError(err, OperationType.UPDATE, `courses/${course.id}`);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteDoc(doc(db, 'courses', courseId));
      await loadTeacherData();
    } catch (err) {
      const headers = await getTeacherAuthHeaders();
      if (headers) {
        const res = await apiFetch(`/api/teacher/courses/${encodeURIComponent(courseId)}`, {
          method: 'DELETE',
          headers,
        });
        if (res.ok) {
          await loadTeacherData();
          return;
        }
      }
      handleFirestoreError(err, OperationType.DELETE, `courses/${courseId}`);
    }
  };

  const handleUploadLessonResource = async (file: File) => {
    setUploadingFile(true);
    try {
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const res = await apiFetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, base64Data: btoa(binary) }),
      });
      if (res.ok) {
        const data = (await res.json()) as { url: string };
        setLessonResourceUrl(resolveAssetUrl(data.url) || data.url);
      }
    } finally {
      setUploadingFile(false);
    }
  };

  const handleCreateLesson = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile || !selectedCourseId) return;
    const parentCourse = courses.find((c) => c.id === selectedCourseId);
    if (!parentCourse) return;
    const id = `lesson_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const objectivesList = lessonObjectives
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Record<string, unknown> = {
      id,
      courseId: parentCourse.id,
      title: lessonTitle.trim(),
      chapterTitle: lessonChapter.trim(),
      content: lessonContent.trim(),
      classNumber: parentCourse.classNumber,
      subjectName: parentCourse.subjectName,
      teacherId: profile.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (objectivesList.length > 0) payload.objectives = objectivesList;
    if (lessonVideoUrl.trim()) payload.videoUrl = lessonVideoUrl.trim();
    if (lessonResourceUrl.trim()) payload.resourceUrl = lessonResourceUrl.trim();

    try {
      await setDoc(doc(db, 'lessons', id), payload);
      setLessonTitle('');
      setLessonChapter('');
      setLessonContent('');
      setLessonObjectives('');
      setLessonVideoUrl('');
      setLessonResourceUrl('');
      await loadTeacherData();
    } catch (err) {
      const headers = await getTeacherAuthHeaders();
      if (headers) {
        const res = await apiFetch('/api/teacher/lessons', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            id,
            courseId: parentCourse.id,
            title: lessonTitle.trim(),
            chapterTitle: lessonChapter.trim(),
            content: lessonContent.trim(),
            objectives: objectivesList,
            videoUrl: lessonVideoUrl.trim() || undefined,
            resourceUrl: lessonResourceUrl.trim() || undefined,
            classNumber: parentCourse.classNumber,
            subjectName: parentCourse.subjectName,
          }),
        });
        if (res.ok) {
          setLessonTitle('');
          setLessonChapter('');
          setLessonContent('');
          setLessonObjectives('');
          setLessonVideoUrl('');
          setLessonResourceUrl('');
          await loadTeacherData();
          return;
        }
      }
      handleFirestoreError(err, OperationType.CREATE, `lessons/${id}`);
    }
  };

  const handleAddDraftQuestion = () => {
    if (!qPrompt.trim() || !qOpt0.trim() || !qOpt1.trim() || !qOpt2.trim() || !qOpt3.trim()) return;
    setDraftQuestions((prev) => [
      ...prev,
      {
        id: `tq_${Date.now()}_${prev.length}`,
        question: qPrompt.trim(),
        options: [qOpt0.trim(), qOpt1.trim(), qOpt2.trim(), qOpt3.trim()],
        correctIndex: qCorrect,
        explanation: qExplanation.trim() || 'Review the corresponding CBSE concept summary.',
      },
    ]);
    setQPrompt('');
    setQOpt0('');
    setQOpt1('');
    setQOpt2('');
    setQOpt3('');
    setQExplanation('');
  };

  const handleSaveQuiz = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile || draftQuestions.length === 0 || !quizTitle.trim()) return;
    const id = `quiz_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    try {
      await setDoc(doc(db, 'quizzes', id), {
        id,
        title: quizTitle.trim(),
        classNumber: quizClass,
        subjectName: quizSubject,
        timeLimitMinutes: quizTime,
        passingScore: 60,
        questions: draftQuestions,
        teacherId: profile.uid,
        published: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setQuizTitle('');
      setDraftQuestions([]);
      await loadTeacherData();
    } catch (err) {
      const headers = await getTeacherAuthHeaders();
      if (headers) {
        const res = await apiFetch('/api/teacher/quizzes', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            id,
            title: quizTitle.trim(),
            classNumber: quizClass,
            subjectName: quizSubject,
            timeLimitMinutes: quizTime,
            passingScore: 60,
            questions: draftQuestions,
          }),
        });
        if (res.ok) {
          setQuizTitle('');
          setDraftQuestions([]);
          await loadTeacherData();
          return;
        }
      }
      handleFirestoreError(err, OperationType.CREATE, `quizzes/${id}`);
    }
  };

  const handleCreateAssignment = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const id = `assign_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    try {
      await setDoc(doc(db, 'assignments', id), {
        id,
        title: assignTitle.trim(),
        description: assignDesc.trim(),
        classNumber: assignClass,
        subjectName: assignSubject,
        dueDate: assignDue,
        maxMarks: assignMarks,
        teacherId: profile.uid,
        teacherName: profile.displayName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setAssignTitle('');
      setAssignDesc('');
      await loadTeacherData();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `assignments/${id}`);
    }
  };

  const handleGradeSubmission = async (sub: SubmissionRecord) => {
    if (!profile) return;
    const input = gradeInputs[sub.id];
    if (!input) return;
    try {
      await updateDoc(doc(db, 'submissions', sub.id), {
        status: 'graded',
        marks: Number(input.marks),
        feedback: input.feedback.trim() || 'Reviewed by teacher.',
        gradedBy: profile.uid,
        updatedAt: serverTimestamp(),
      });
      await loadTeacherData();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `submissions/${sub.id}`);
    }
  };

  const handleExportStudentCSV = () => {
    const filtered = studentClassFilter
      ? students.filter((s) => s.classNumber === studentClassFilter)
      : students;
    const rows = [
      ['Name', 'Class', 'Lessons Completed', 'Avg Quiz Score (%)', 'Streak Days', 'XP'],
      ...filtered.map((s) => [
        `"${s.displayName.replace(/"/g, '""')}"`,
        String(s.classNumber),
        String(s.lessonsCompleted),
        String(s.avgQuizScore),
        String(s.streakDays),
        String(s.xp),
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IndoAmericanSchool_Student_Report_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pendingSubmissions = submissions.filter((s) => s.status === 'submitted');
  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses & Lessons', icon: BookOpen, badge: courses.length },
    { id: 'quizzes', label: 'Quiz Builder', icon: FileCheck2, badge: quizzes.length },
    { id: 'assignments', label: 'Assignments & Grading', icon: ClipboardCheck, badge: pendingSubmissions.length },
    { id: 'students', label: 'Student Monitoring', icon: Users, badge: students.length },
    { id: 'forum', label: 'Doubt Forum', icon: MessageSquare },
  ];

  const filteredStudents = studentClassFilter
    ? students.filter((s) => s.classNumber === studentClassFilter)
    : students;

  return (
    <DashboardLayout
      roleLabel="Indo American School · Faculty Studio"
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-indigo-200/70 bg-indigo-50/60 p-5">
              <BookOpen className="h-5 w-5 text-indigo-700 mb-2" />
              <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">{courses.length}</p>
              <p className="text-xs text-slate-600">Published Courses · {lessons.length} Lessons</p>
            </div>
            <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-5">
              <FileCheck2 className="h-5 w-5 text-emerald-700 mb-2" />
              <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">{quizzes.length}</p>
              <p className="text-xs text-slate-600">Custom Teacher Quizzes</p>
            </div>
            <div className="rounded-2xl border border-orange-200/70 bg-orange-50/60 p-5">
              <ClipboardCheck className="h-5 w-5 text-orange-600 mb-2" />
              <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">{pendingSubmissions.length}</p>
              <p className="text-xs text-slate-600">Submissions Awaiting Grade</p>
            </div>
            <div className="rounded-2xl border border-sky-200/70 bg-sky-50/60 p-5">
              <Users className="h-5 w-5 text-sky-700 mb-2" />
              <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">{students.length}</p>
              <p className="text-xs text-slate-600">Active CBSE Students</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900">Quick Teaching Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('courses')}
                className="rounded-2xl border border-slate-200 bg-[#FAFBFD] p-4 text-left hover:border-indigo-300 cursor-pointer"
              >
                <p className="text-sm font-bold text-slate-900">Publish CBSE Course & Lesson</p>
                <p className="text-xs text-slate-500 mt-1">Attach notes, video URLs, or study PDFs.</p>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('quizzes')}
                className="rounded-2xl border border-slate-200 bg-[#FAFBFD] p-4 text-left hover:border-indigo-300 cursor-pointer"
              >
                <p className="text-sm font-bold text-slate-900">Create Timed MCQ Quiz</p>
                <p className="text-xs text-slate-500 mt-1">Build class-wise assessments with explanations.</p>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('assignments')}
                className="rounded-2xl border border-slate-200 bg-[#FAFBFD] p-4 text-left hover:border-indigo-300 cursor-pointer"
              >
                <p className="text-sm font-bold text-slate-900">Grade Student Submissions</p>
                <p className="text-xs text-slate-500 mt-1">Assign marks and constructive feedback.</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form onSubmit={handleCreateCourse} className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 space-y-3 h-fit">
              <h2 className="font-display text-lg font-bold text-slate-900">Create CBSE Course</h2>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={courseClass}
                  onChange={(e) => setCourseClass(Number(e.target.value))}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((c) => (
                    <option key={c} value={c}>Class {c}</option>
                  ))}
                </select>
                <select
                  value={courseSubjectId}
                  onChange={(e) => setCourseSubjectId(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
                >
                  {getSubjectsForClass(courseClass).map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                required
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="Course Title (e.g. Board Exam Science Bootcamp)"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
              <textarea
                rows={3}
                required
                value={courseDesc}
                onChange={(e) => setCourseDesc(e.target.value)}
                placeholder="Course overview and key topics..."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Create & Publish Course</span>
              </button>
            </form>

            <form onSubmit={handleCreateLesson} className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 space-y-3">
              <h2 className="font-display text-lg font-bold text-slate-900">Add Lesson to Course</h2>
              <select
                required
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
              >
                <option value="">Select a course...</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    Class {c.classNumber} · {c.subjectName} — {c.title}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="Lesson Title"
                  className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm"
                />
                <input
                  type="text"
                  required
                  value={lessonChapter}
                  onChange={(e) => setLessonChapter(e.target.value)}
                  placeholder="Chapter Name"
                  className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm"
                />
              </div>
              <textarea
                rows={4}
                required
                value={lessonContent}
                onChange={(e) => setLessonContent(e.target.value)}
                placeholder="Write complete lesson notes & solved examples..."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm"
              />
              <textarea
                rows={2}
                value={lessonObjectives}
                onChange={(e) => setLessonObjectives(e.target.value)}
                placeholder="Learning objectives (one per line, optional)"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="url"
                  value={lessonVideoUrl}
                  onChange={(e) => setLessonVideoUrl(e.target.value)}
                  placeholder="Video URL (optional)"
                  className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm"
                />
                <label className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100">
                  <Upload className="h-4 w-4" />
                  <span>{uploadingFile ? 'Uploading...' : lessonResourceUrl ? 'File Attached ✓' : 'Upload PDF / Notes'}</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void handleUploadLessonResource(f);
                    }}
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={!selectedCourseId}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
              >
                Publish Lesson
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3">
            <h3 className="font-display text-base font-bold text-slate-900">Your Courses</h3>
            {courses.length === 0 ? (
              <p className="text-xs text-slate-500">Create your first CBSE course above.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-slate-200/80 bg-[#FAFBFD] p-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-indigo-600">
                        Class {c.classNumber} · {c.subjectName} · {c.published ? 'Published' : 'Draft'}
                      </p>
                      <p className="font-bold text-slate-900">{c.title}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {lessons.filter((l) => l.courseId === c.id).length} lessons attached
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => void handleTogglePublishCourse(c)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer"
                      >
                        {c.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteCourse(c.id)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'quizzes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onSubmit={handleSaveQuiz} className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900">Create Timed MCQ Quiz</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={quizClass}
                onChange={(e) => setQuizClass(Number(e.target.value))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((c) => (
                  <option key={c} value={c}>Class {c}</option>
                ))}
              </select>
              <select
                value={quizSubject}
                onChange={(e) => setQuizSubject(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
              >
                {getSubjectsForClass(quizClass).map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
              <input
                type="number"
                min={2}
                max={120}
                value={quizTime}
                onChange={(e) => setQuizTime(Number(e.target.value))}
                placeholder="Minutes"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono tabular-nums"
              />
            </div>

            <input
              type="text"
              required
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Quiz Title (e.g. Trigonometry Practice Test)"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-3">
              <p className="text-xs font-bold text-indigo-900">Add Question ({draftQuestions.length} added)</p>
              <input
                type="text"
                value={qPrompt}
                onChange={(e) => setQPrompt(e.target.value)}
                placeholder="Question prompt..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input type="text" value={qOpt0} onChange={(e) => setQOpt0(e.target.value)} placeholder="Option A" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs" />
                <input type="text" value={qOpt1} onChange={(e) => setQOpt1(e.target.value)} placeholder="Option B" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs" />
                <input type="text" value={qOpt2} onChange={(e) => setQOpt2(e.target.value)} placeholder="Option C" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs" />
                <input type="text" value={qOpt3} onChange={(e) => setQOpt3(e.target.value)} placeholder="Option D" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={qCorrect}
                  onChange={(e) => setQCorrect(Number(e.target.value))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold"
                >
                  <option value={0}>Correct Answer: Option A</option>
                  <option value={1}>Correct Answer: Option B</option>
                  <option value={2}>Correct Answer: Option C</option>
                  <option value={3}>Correct Answer: Option D</option>
                </select>
                <input
                  type="text"
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  placeholder="Short explanation"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                />
              </div>
              <button
                type="button"
                onClick={handleAddDraftQuestion}
                className="rounded-xl border border-indigo-200 bg-white px-3.5 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 cursor-pointer"
              >
                + Add Question to Quiz
              </button>
            </div>

            <button
              type="submit"
              disabled={draftQuestions.length === 0}
              className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
            >
              Publish Quiz ({draftQuestions.length} Questions)
            </button>
          </form>

          <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 space-y-3 h-fit">
            <h3 className="font-display text-base font-bold text-slate-900">Your Published Quizzes</h3>
            {quizzes.length === 0 ? (
              <p className="text-xs text-slate-500">No custom quizzes created yet.</p>
            ) : (
              quizzes.map((q) => (
                <div key={q.id} className="rounded-2xl border border-slate-200/80 bg-[#FAFBFD] p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-indigo-600">Class {q.classNumber} · {q.subjectName}</p>
                    <p className="text-sm font-bold text-slate-900">{q.title}</p>
                    <p className="text-xs text-slate-500 tabular-nums">{q.questions.length} Qs · {q.timeLimitMinutes} mins</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form onSubmit={handleCreateAssignment} className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 space-y-3 h-fit">
              <h2 className="font-display text-lg font-bold text-slate-900">Create Assignment</h2>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={assignClass}
                  onChange={(e) => setAssignClass(Number(e.target.value))}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((c) => (
                    <option key={c} value={c}>Class {c}</option>
                  ))}
                </select>
                <select
                  value={assignSubject}
                  onChange={(e) => setAssignSubject(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
                >
                  {getSubjectsForClass(assignClass).map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                required
                value={assignTitle}
                onChange={(e) => setAssignTitle(e.target.value)}
                placeholder="Assignment Title"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
              <textarea
                rows={3}
                required
                value={assignDesc}
                onChange={(e) => setAssignDesc(e.target.value)}
                placeholder="Instructions and rubric..."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={assignDue}
                  onChange={(e) => setAssignDue(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={assignMarks}
                  onChange={(e) => setAssignMarks(Number(e.target.value))}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 cursor-pointer"
              >
                Publish Assignment ({assignments.length} active)
              </button>
            </form>

            <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-slate-900">Student Submissions ({submissions.length})</h2>
              {submissions.length === 0 ? (
                <p className="text-xs text-slate-500">No student submissions received yet.</p>
              ) : (
                <div className="space-y-3">
                  {submissions.map((sub) => {
                    const g = gradeInputs[sub.id] ?? { marks: sub.marks ?? 20, feedback: sub.feedback ?? '' };
                    return (
                      <div key={sub.id} className="rounded-2xl border border-slate-200/80 bg-[#FAFBFD] p-4 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-xs font-semibold text-indigo-600">
                              {sub.studentName} · Class {sub.classNumber}
                            </p>
                            <p className="text-sm font-bold text-slate-900">{sub.assignmentTitle}</p>
                          </div>
                          <span className={`text-xs font-bold ${sub.status === 'graded' ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {sub.status === 'graded' ? `Graded (${sub.marks})` : 'Needs Grading'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 whitespace-pre-wrap">{sub.answerText}</p>
                        {sub.attachmentUrl && (
                          <a href={resolveAssetUrl(sub.attachmentUrl)} target="_blank" rel="noreferrer" className="text-xs font-semibold text-indigo-600 hover:underline inline-block">
                            View Attachment ({sub.attachmentName ?? 'File'})
                          </a>
                        )}
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={g.marks}
                            onChange={(e) =>
                              setGradeInputs((prev) => ({ ...prev, [sub.id]: { ...g, marks: Number(e.target.value) } }))
                            }
                            className="w-20 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-mono"
                          />
                          <input
                            type="text"
                            value={g.feedback}
                            onChange={(e) =>
                              setGradeInputs((prev) => ({ ...prev, [sub.id]: { ...g, feedback: e.target.value } }))
                            }
                            placeholder="Write teacher feedback..."
                            className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => void handleGradeSubmission(sub)}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 cursor-pointer"
                          >
                            Save Grade
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">Student Performance Monitoring</h2>
              <p className="text-xs text-slate-500">Track lesson completions, quiz averages, and download class reports.</p>
            </div>
            <div className="flex items-center gap-2.5">
              <select
                value={studentClassFilter}
                onChange={(e) => setStudentClassFilter(Number(e.target.value))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold bg-white"
              >
                <option value={0}>All Classes</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((c) => (
                  <option key={c} value={c}>Class {c}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleExportStudentCSV}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2.5 pr-4">Student</th>
                  <th className="py-2.5 pr-4">Class</th>
                  <th className="py-2.5 pr-4">Lessons Completed</th>
                  <th className="py-2.5 pr-4">Avg Quiz Score</th>
                  <th className="py-2.5 pr-4">Streak</th>
                  <th className="py-2.5">XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => (
                  <tr key={st.uid}>
                    <td className="py-3 pr-4 font-semibold text-slate-900">{st.displayName}</td>
                    <td className="py-3 pr-4 font-mono tabular-nums">Class {st.classNumber}</td>
                    <td className="py-3 pr-4 font-mono tabular-nums">{st.lessonsCompleted}</td>
                    <td className="py-3 pr-4 font-mono tabular-nums">
                      <span className={st.avgQuizScore < 70 ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>
                        {st.avgQuizScore}%
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-mono tabular-nums">{st.streakDays}d</td>
                    <td className="py-3 font-mono font-bold text-indigo-700 tabular-nums">{st.xp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'forum' && <DoubtForumPanel />}
    </DashboardLayout>
  );
}
