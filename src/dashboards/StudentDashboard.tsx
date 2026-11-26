import { useEffect, useState } from 'react';
import {
  Award,
  BookOpen,
  Bot,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileCheck2,
  Flame,
  LayoutDashboard,
  MessageSquare,
  NotebookPen,
  Play,
  Sparkles,
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { DashboardLayout, type NavItem } from '../components/DashboardLayout';
import { DoubtForumPanel } from '../components/DoubtForumPanel';
import { SmartQuizRunner } from '../components/SmartQuizRunner';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { getAllChaptersForClass, getSubjectsForClass, SAMPLE_ASSIGNMENTS } from '../curriculum/cbseCurriculum';
import { db } from '../lib/firebase';
import type { CBSEChapter, QuizRecord } from '../types/curriculum';
import { StudentLearningView } from './student/StudentLearningView';
import {
  StudentAchievementsPanel,
  StudentAIAssistantPanel,
  StudentAssignmentsPanel,
  StudentNotesPanel,
  StudentProgressPlannerPanel,
} from './student/StudentSecondaryPanels';

export default function StudentDashboard() {
  const { profile, studentProfile } = useAuth();
  const { isOnline, downloadedPackages, progressList, quizAttempts, pendingSyncCount } = useOffline();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeQuiz, setActiveQuiz] = useState<{
    quizId: string;
    quizTitle: string;
    classNumber: number;
    subjectName: string;
    chapterId?: string;
    timeLimitMinutes: number;
    passingScore: number;
    questions: QuizRecord['questions'];
  } | null>(null);
  const [teacherQuizzes, setTeacherQuizzes] = useState<QuizRecord[]>([]);

  const cls = profile?.classNumber ?? 10;
  const classSubjects = getSubjectsForClass(cls);
  const classChapters = getAllChaptersForClass(cls);

  useEffect(() => {
    const loadQuizzes = async () => {
      if (!navigator.onLine) return;
      try {
        const snap = await getDocs(
          query(collection(db, 'quizzes'), where('published', '==', true), where('classNumber', '==', cls))
        );
        setTeacherQuizzes(snap.docs.map((d) => d.data() as QuizRecord));
      } catch {
        // ignore offline errors
      }
    };
    void loadQuizzes();
  }, [cls, isOnline]);

  const completedLessonsCount = progressList.filter((p) => p.completed).length;
  const avgScore =
    quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((acc, q) => acc + q.percentage, 0) / quizAttempts.length)
      : 0;
  const streak = studentProfile?.streakDays ?? 1;
  const xp = studentProfile?.xp ?? 50 + completedLessonsCount * 25;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'learning', label: 'My Learning', icon: BookOpen, badge: downloadedPackages.length },
    { id: 'quiz', label: 'Smart Quiz', icon: FileCheck2, badge: quizAttempts.length },
    { id: 'assignments', label: 'Assignments', icon: ClipboardCheck },
    { id: 'progress', label: 'Progress & Planner', icon: Calendar },
    { id: 'notes', label: 'Digital Notebook', icon: NotebookPen },
    { id: 'ai', label: 'AI Doubt Solver', icon: Bot },
    { id: 'forum', label: 'Doubt Forum', icon: MessageSquare },
    { id: 'achievements', label: 'Badges & Reports', icon: Award },
  ];

  const startChapterQuiz = (chapter: CBSEChapter) => {
    setActiveQuiz({
      quizId: chapter.id,
      quizTitle: `${chapter.title} — Chapter Quiz`,
      classNumber: chapter.classNumber,
      subjectName: chapter.subjectName,
      chapterId: chapter.id,
      timeLimitMinutes: 10,
      passingScore: 60,
      questions: chapter.quizQuestions,
    });
    setActiveTab('quiz');
  };

  return (
    <DashboardLayout
      roleLabel="Indo American School · Student Portal"
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        if (tab !== 'quiz') setActiveQuiz(null);
      }}
    >
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="rounded-3xl border border-sky-200/80 bg-gradient-to-r from-sky-50/90 via-white to-amber-50/60 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                Indo American School · CBSE Class {cls} · {profile?.preferredLanguage ?? 'English'} Medium
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F2744]">
                Welcome back, {profile?.displayName ?? 'Student'}
              </h2>
              <p className="text-sm text-slate-600 max-w-xl">
                {downloadedPackages.length > 0
                  ? `${downloadedPackages.length} chapter packages are saved in your offline vault and ready without internet.`
                  : 'Download chapter packages in My Learning so you can study and take quizzes even offline.'}
                {pendingSyncCount > 0 ? ` ${pendingSyncCount} offline updates queued for sync.` : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('learning')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0F2744] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1E3A5F] cursor-pointer shrink-0"
            >
              <Play className="h-4 w-4 text-amber-300" />
              <span>Continue Learning</span>
            </button>
          </div>

          {/* 4 Pastel KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-5">
              <CheckCircle2 className="h-5 w-5 text-emerald-700 mb-2" />
              <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">{completedLessonsCount}</p>
              <p className="text-xs text-slate-600">Lessons Completed</p>
            </div>
            <div className="rounded-2xl border border-sky-200/70 bg-sky-50/60 p-5">
              <FileCheck2 className="h-5 w-5 text-sky-700 mb-2" />
              <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">{avgScore}%</p>
              <p className="text-xs text-slate-600">Average Quiz Score</p>
            </div>
            <div className="rounded-2xl border border-orange-200/70 bg-orange-50/60 p-5">
              <Flame className="h-5 w-5 text-orange-600 mb-2" />
              <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">{streak} days</p>
              <p className="text-xs text-slate-600">Daily Learning Streak</p>
            </div>
            <div className="rounded-2xl border border-violet-200/70 bg-violet-50/60 p-5">
              <Sparkles className="h-5 w-5 text-violet-700 mb-2" />
              <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">{xp}</p>
              <p className="text-xs text-slate-600">Total Learning XP</p>
            </div>
          </div>

          {/* Subjects + Offline Downloads + Assignments Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-slate-900">Class {cls} Enrolled Subjects</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('learning')}
                  className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  Explore All →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {classSubjects.map((s) => (
                  <div key={s.id} className="rounded-2xl border border-slate-200/80 bg-[#FAFBFD] p-4">
                    <p className="text-xs font-semibold text-indigo-600">{s.category}</p>
                    <p className="mt-0.5 font-bold text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{s.chapters.length} chapters · Ready offline</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-slate-900">Offline Vault Packages</h3>
                  <Download className="h-4 w-4 text-emerald-600" />
                </div>
                {downloadedPackages.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    No chapters cached yet. Open My Learning and click Download on any chapter.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {downloadedPackages.slice(0, 4).map((pkg) => (
                      <div key={pkg.id} className="rounded-xl bg-emerald-50/50 border border-emerald-200/70 px-3 py-2 text-xs flex justify-between">
                        <span className="font-semibold text-slate-900 truncate pr-2">{pkg.title}</span>
                        <span className="font-mono text-emerald-800 shrink-0">Class {pkg.classNumber}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3">
                <h3 className="font-display text-base font-bold text-slate-900">Upcoming CBSE Assignments</h3>
                {SAMPLE_ASSIGNMENTS.filter((a) => a.classNumber === cls)
                  .slice(0, 2)
                  .map((a) => (
                    <div key={a.id} className="rounded-xl bg-[#FAFBFD] border border-slate-200/80 p-3 text-xs">
                      <p className="font-bold text-slate-900">{a.title}</p>
                      <p className="text-slate-500 mt-0.5">
                        {a.subjectName} · Due {a.dueDate}
                      </p>
                    </div>
                  ))}
                <button
                  type="button"
                  onClick={() => setActiveTab('assignments')}
                  className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  Open Assignments →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'learning' && <StudentLearningView onStartChapterQuiz={startChapterQuiz} />}

      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {activeQuiz ? (
            <SmartQuizRunner
              {...activeQuiz}
              onExit={() => setActiveQuiz(null)}
            />
          ) : (
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-bold text-slate-900">
                      Class {cls} Smart Chapter Quizzes
                    </h2>
                    <p className="text-xs text-slate-500">
                      All built-in CBSE chapter quizzes work 100% offline and sync automatically on reconnect.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classChapters.slice(0, 9).map((ch) => (
                    <div key={ch.id} className="rounded-2xl border border-slate-200/80 bg-[#FAFBFD] p-4 flex flex-col justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-indigo-600">
                          {ch.subjectName} · Ch {ch.chapterNumber}
                        </p>
                        <p className="mt-1 text-sm font-bold text-slate-900">{ch.title}</p>
                        <p className="text-xs text-slate-500 mt-1 tabular-nums">
                          {ch.quizQuestions.length} Questions · 10 mins
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => startChapterQuiz(ch)}
                        className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
                      >
                        Start Quiz
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {teacherQuizzes.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
                  <h2 className="font-display text-lg font-bold text-slate-900">Teacher Assigned Quizzes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teacherQuizzes.map((q) => (
                      <div key={q.id} className="rounded-2xl border border-violet-200/80 bg-violet-50/40 p-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-violet-700">{q.subjectName}</p>
                          <p className="font-bold text-slate-900">{q.title}</p>
                          <p className="text-xs text-slate-500 tabular-nums">
                            {q.questions.length} Qs · {q.timeLimitMinutes} mins
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveQuiz({
                              quizId: q.id,
                              quizTitle: q.title,
                              classNumber: q.classNumber,
                              subjectName: q.subjectName,
                              timeLimitMinutes: q.timeLimitMinutes,
                              passingScore: q.passingScore,
                              questions: q.questions,
                            })
                          }
                          className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
                        >
                          Start
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quiz History */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3">
                <h3 className="font-display text-base font-bold text-slate-900">Recent Quiz Attempts</h3>
                {quizAttempts.length === 0 ? (
                  <p className="text-xs text-slate-500">No quiz attempts recorded yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="py-2 pr-4">Quiz</th>
                          <th className="py-2 pr-4">Subject</th>
                          <th className="py-2 pr-4">Score</th>
                          <th className="py-2 pr-4">Mode</th>
                          <th className="py-2">Sync</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {quizAttempts.slice(0, 12).map((att) => (
                          <tr key={att.operationId}>
                            <td className="py-2.5 pr-4 font-semibold text-slate-900">{att.quizTitle}</td>
                            <td className="py-2.5 pr-4 text-slate-600">{att.subjectName}</td>
                            <td className="py-2.5 pr-4 font-mono font-bold tabular-nums text-indigo-700">
                              {att.score}/{att.totalQuestions} ({att.percentage}%)
                            </td>
                            <td className="py-2.5 pr-4 text-slate-600">
                              {att.attemptedOffline ? 'Offline' : 'Online'}
                            </td>
                            <td className="py-2.5">
                              <span className={att.syncStatus === 'pending' ? 'text-amber-700 font-semibold' : 'text-emerald-700 font-semibold'}>
                                {att.syncStatus === 'pending' ? 'Pending' : 'Synced'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'assignments' && <StudentAssignmentsPanel />}
      {activeTab === 'progress' && <StudentProgressPlannerPanel />}
      {activeTab === 'notes' && <StudentNotesPanel />}
      {activeTab === 'ai' && <StudentAIAssistantPanel />}
      {activeTab === 'forum' && <DoubtForumPanel />}
      {activeTab === 'achievements' && <StudentAchievementsPanel />}
    </DashboardLayout>
  );
}
