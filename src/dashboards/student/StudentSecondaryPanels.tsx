import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Bot,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  Flame,
  NotebookPen,
  Paperclip,
  Plus,
  Send,
  Share2,
  Sparkles,
  Trash2,
  Trophy,
} from 'lucide-react';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';
import { getAllChaptersForClass, getSubjectsForClass, SAMPLE_ASSIGNMENTS } from '../../curriculum/cbseCurriculum';
import { apiFetch, resolveAssetUrl } from '../../lib/api';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import type {
  AssignmentRecord,
  CertificateRecord,
  ParentReportRecord,
  StudentProfile,
  SubmissionRecord,
} from '../../types/curriculum';

export function StudentAssignmentsPanel() {
  const { profile } = useAuth();
  const { isOnline } = useOffline();
  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [activeAssign, setActiveAssign] = useState<AssignmentRecord | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const loadData = async () => {
    const cls = profile?.classNumber ?? 10;
    const sampleForClass: AssignmentRecord[] = SAMPLE_ASSIGNMENTS.filter((a) => a.classNumber === cls);
    const fallbackSamples = sampleForClass.length > 0 ? sampleForClass : SAMPLE_ASSIGNMENTS.slice(0, 3);

    if (!navigator.onLine || !profile) {
      setAssignments(fallbackSamples);
      return;
    }

    try {
      const [aSnap, sSnap] = await Promise.all([
        getDocs(query(collection(db, 'assignments'), where('classNumber', '==', cls))),
        getDocs(query(collection(db, 'submissions'), where('userId', '==', profile.uid))),
      ]);
      const dbAssignments = aSnap.docs.map((d) => d.data() as AssignmentRecord);
      setAssignments([...dbAssignments, ...fallbackSamples]);
      setSubmissions(sSnap.docs.map((d) => d.data() as SubmissionRecord));
    } catch {
      setAssignments(fallbackSamples);
    }
  };

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.uid, profile?.classNumber, isOnline]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile || !activeAssign || !isOnline) return;
    setSubmitting(true);
    setFeedbackMsg(null);
    try {
      let attachmentUrl: string | undefined;
      let attachmentName: string | undefined;

      if (attachmentFile) {
        const buf = await attachmentFile.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Data = btoa(binary);
        const res = await apiFetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: attachmentFile.name, base64Data }),
        });
        if (res.ok) {
          const uploaded = (await res.json()) as { url: string; fileName: string };
          attachmentUrl = resolveAssetUrl(uploaded.url);
          attachmentName = uploaded.fileName;
        }
      }

      const subId = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const payload: Record<string, unknown> = {
        id: subId,
        assignmentId: activeAssign.id,
        assignmentTitle: activeAssign.title,
        teacherId: activeAssign.teacherId,
        userId: profile.uid,
        studentName: profile.displayName,
        classNumber: activeAssign.classNumber,
        answerText: answerText.trim(),
        status: 'submitted',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (attachmentName && attachmentUrl) {
        payload.attachmentName = attachmentName;
        payload.attachmentUrl = attachmentUrl;
      }

      await setDoc(doc(db, 'submissions', subId), payload);
      setAnswerText('');
      setAttachmentFile(null);
      setActiveAssign(null);
      setFeedbackMsg('Assignment submitted successfully!');
      await loadData();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'submissions');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {feedbackMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {activeAssign && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-indigo-200 bg-white p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-indigo-600">
                Submit Assignment · {activeAssign.subjectName} · Max Marks {activeAssign.maxMarks}
              </p>
              <h3 className="font-display text-lg font-bold text-slate-900">{activeAssign.title}</h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveAssign(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
          </div>
          <p className="text-sm text-slate-600">{activeAssign.description}</p>
          <textarea
            rows={4}
            required
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Write your complete solution here..."
            className="w-full rounded-xl border border-slate-200 p-3.5 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100">
              <Paperclip className="h-4 w-4" />
              <span>{attachmentFile ? attachmentFile.name : 'Attach Worksheet / Image (Optional)'}</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setAttachmentFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <button
              type="submit"
              disabled={submitting || !isOnline}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
            >
              {submitting ? 'Submitting...' : isOnline ? 'Submit Work' : 'Reconnect to Submit'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {assignments.map((assign) => {
          const existingSub = submissions.find((s) => s.assignmentId === assign.id);
          return (
            <div key={assign.id} className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-indigo-700">
                    Class {assign.classNumber} · {assign.subjectName}
                  </span>
                  <span className="font-mono tabular-nums">Due {assign.dueDate}</span>
                </div>
                <h3 className="mt-1.5 font-display text-lg font-bold text-slate-900">{assign.title}</h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{assign.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {existingSub ? (
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-emerald-700">
                      {existingSub.status === 'graded'
                        ? `Graded: ${existingSub.marks ?? 0} / ${assign.maxMarks}`
                        : 'Submitted · Awaiting Review'}
                    </p>
                    {existingSub.feedback && (
                      <p className="text-xs text-slate-600">Feedback: {existingSub.feedback}</p>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 tabular-nums">Max {assign.maxMarks} Marks</span>
                )}

                {!existingSub && (
                  <button
                    type="button"
                    onClick={() => setActiveAssign(assign)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
                  >
                    <ClipboardCheck className="h-3.5 w-3.5" />
                    <span>Attempt</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function StudentProgressPlannerPanel() {
  const { profile, updateProfileFields } = useAuth();
  const { progressList, quizAttempts } = useOffline();
  const [goalInput, setGoalInput] = useState<number>(profile?.dailyGoalMinutes ?? 45);
  const [goalSaved, setGoalSaved] = useState(false);

  const cls = profile?.classNumber ?? 10;
  const subjects = getSubjectsForClass(cls);
  const chapters = getAllChaptersForClass(cls);

  const weakChapters = chapters.filter((ch) => {
    const attempts = quizAttempts.filter((q) => q.chapterId === ch.id || q.quizId === ch.id);
    if (attempts.length === 0) return false;
    const avg = attempts.reduce((a, b) => a + b.percentage, 0) / attempts.length;
    return avg < 70;
  });

  const uncompletedChapters = chapters.filter((ch) => !progressList.some((p) => p.lessonId === ch.id && p.completed));
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleSaveGoal = async (e: FormEvent) => {
    e.preventDefault();
    await updateProfileFields({ dailyGoalMinutes: goalInput });
    setGoalSaved(true);
    setTimeout(() => setGoalSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subject Progress */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-slate-900">Class {cls} Subject Mastery</h2>
          <div className="space-y-4">
            {subjects.map((sub) => {
              const total = sub.chapters.length;
              const done = sub.chapters.filter((ch) =>
                progressList.some((p) => p.lessonId === ch.id && p.completed)
              ).length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <div key={sub.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800">{sub.name}</span>
                    <span className="font-mono text-indigo-700 tabular-nums">
                      {done}/{total} chapters ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weak Topics + Daily Goal */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl border border-orange-200/80 bg-orange-50/50 p-6 space-y-3">
            <h3 className="font-display text-base font-bold text-slate-900">Weak Topic Detector</h3>
            {weakChapters.length === 0 ? (
              <p className="text-xs text-slate-600">
                No weak chapters detected yet (scores below 70%). Keep attempting chapter quizzes to track revision priorities.
              </p>
            ) : (
              <div className="space-y-2">
                {weakChapters.map((ch) => (
                  <div key={ch.id} className="rounded-xl bg-white border border-orange-200 px-3.5 py-2.5 text-xs">
                    <p className="font-bold text-slate-900">{ch.title}</p>
                    <p className="text-slate-500">{ch.subjectName} · Recommended for revision</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSaveGoal} className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3">
            <h3 className="font-display text-base font-bold text-slate-900">Daily Study Goal</h3>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={10}
                max={240}
                value={goalInput}
                onChange={(e) => setGoalInput(Number(e.target.value))}
                className="w-28 rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono tabular-nums"
              />
              <span className="text-xs text-slate-500">minutes / day</span>
              <button
                type="submit"
                className="ml-auto rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
              >
                Save Goal
              </button>
            </div>
            {goalSaved && <p className="text-xs font-semibold text-emerald-700">Daily goal updated!</p>}
          </form>
        </div>
      </div>

      {/* Weekly Smart Revision Planner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <h2 className="font-display text-lg font-bold text-slate-900">Personalized Weekly Revision Calendar</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {weekDays.map((day, idx) => {
            const targetChapter = weakChapters[idx] ?? uncompletedChapters[idx] ?? chapters[idx % chapters.length];
            return (
              <div key={day} className="rounded-2xl border border-slate-200/80 bg-[#FAFBFD] p-4 space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">{day} · {goalInput} mins</p>
                {targetChapter ? (
                  <>
                    <p className="text-sm font-bold text-slate-900">{targetChapter.title}</p>
                    <p className="text-xs text-slate-500">
                      {targetChapter.subjectName} · Study Notes + 5-Q Revision Quiz
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-slate-500">Free revision slot</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function StudentNotesPanel() {
  const { profile } = useAuth();
  const { notes, upsertNote, deleteNote } = useOffline();
  const [classNumber, setClassNumber] = useState(profile?.classNumber ?? 10);
  const [subjectName, setSubjectName] = useState(getSubjectsForClass(profile?.classNumber ?? 10)[0]?.name ?? 'Mathematics');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | undefined>(undefined);

  const subjects = getSubjectsForClass(classNumber);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    await upsertNote({
      id: editingId,
      classNumber,
      subjectName,
      title: title.trim(),
      content: content.trim(),
    });
    setTitle('');
    setContent('');
    setEditingId(undefined);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <form onSubmit={handleSave} className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 space-y-4 h-fit">
        <div className="flex items-center gap-2">
          <NotebookPen className="h-5 w-5 text-indigo-600" />
          <h2 className="font-display text-lg font-bold text-slate-900">
            {editingId ? 'Edit Study Note' : 'New Offline Note'}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select
            value={classNumber}
            onChange={(e) => {
              const cls = Number(e.target.value);
              setClassNumber(cls);
              const s = getSubjectsForClass(cls);
              if (s[0]) setSubjectName(s[0].name);
            }}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((c) => (
              <option key={c} value={c}>Class {c}</option>
            ))}
          </select>
          <select
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>

        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title (e.g. Ohm's Law Formulas)"
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <textarea
          rows={6}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write key formulas, definitions, or Hindi meanings... Works completely offline!"
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{editingId ? 'Update Note' : 'Save Note Offline'}</span>
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(undefined);
                setTitle('');
                setContent('');
              }}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="lg:col-span-7 space-y-3">
        {notes.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Your Digital Notebook is empty. Add your first offline revision note on the left.
          </div>
        ) : (
          notes.map((n) => (
            <div key={n.id} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-indigo-600">
                    Class {n.classNumber} · {n.subjectName} ·{' '}
                    <span className={n.syncStatus === 'pending' ? 'text-amber-600' : 'text-emerald-600'}>
                      {n.syncStatus === 'pending' ? 'Pending Sync' : 'Synced'}
                    </span>
                  </p>
                  <h3 className="font-display text-base font-bold text-slate-900">{n.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(n.id);
                      setClassNumber(n.classNumber);
                      setSubjectName(n.subjectName);
                      setTitle(n.title);
                      setContent(n.content);
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteNote(n.id)}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    aria-label="Delete note"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{n.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function StudentAIAssistantPanel() {
  const { profile } = useAuth();
  const { isOnline } = useOffline();
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);
  const [subject, setSubject] = useState(getSubjectsForClass(profile?.classNumber ?? 10)[0]?.name ?? 'Science');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      if (!navigator.onLine) {
        setAiAvailable(false);
        return;
      }
      try {
        const res = await apiFetch('/api/ai/status');
        const data = (await res.json()) as { available: boolean };
        setAiAvailable(Boolean(data.available));
      } catch {
        setAiAvailable(false);
      }
    };
    void checkStatus();
  }, [isOnline]);

  const handleAsk = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !isOnline) return;
    setLoading(true);
    setErrorMsg(null);
    setAnswer(null);
    try {
      const res = await apiFetch('/api/ai/doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classNumber: profile?.classNumber ?? 10,
          subjectName: subject,
          question: question.trim(),
          language: profile?.preferredLanguage ?? 'English',
        }),
      });
      const data = (await res.json()) as { answer?: string; error?: string };
      if (!res.ok) {
        setErrorMsg(data.error ?? 'AI Tutor is currently unavailable.');
      } else {
        setAnswer(data.answer ?? '');
      }
    } catch {
      setErrorMsg('Unable to reach the AI Doubt service right now.');
    } finally {
      setLoading(false);
    }
  };

  const cls = profile?.classNumber ?? 10;
  const subjects = getSubjectsForClass(cls);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">CBSE AI Doubt Assistant</h2>
            <p className="text-xs text-slate-500">Step-by-step explanations tailored to Class {cls} NCERT concepts</p>
          </div>
        </div>

        {!isOnline ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            AI Doubt Solver is unavailable while offline. You can review your downloaded offline chapter study notes and practice Q&A, or reconnect to ask a question.
          </div>
        ) : aiAvailable === false ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            The Gemini AI Doubt service is not configured on this server yet (`GEMINI_API_KEY` missing). Please use the Doubt Discussion Forum to ask teachers and classmates directly!
          </div>
        ) : (
          <form onSubmit={handleAsk} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm bg-white"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Your Question</label>
              <textarea
                rows={3}
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a CBSE concept question, e.g., Explain Ohm's Law with a simple numerical..."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>{loading ? 'Thinking...' : 'Ask Doubt'}</span>
            </button>
          </form>
        )}

        {errorMsg && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{errorMsg}</div>
        )}

        {answer && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Explanation</p>
            <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{answer}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function StudentAchievementsPanel() {
  const { profile, studentProfile } = useAuth();
  const { isOnline, progressList, quizAttempts } = useOffline();
  const [leaderboard, setLeaderboard] = useState<StudentProfile[]>([]);
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [reportLink, setReportLink] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const cls = profile?.classNumber ?? 10;
  const subjects = getSubjectsForClass(cls);
  const completedCount = progressList.filter((p) => p.completed).length;
  const avgQuiz =
    quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((a, b) => a + b.percentage, 0) / quizAttempts.length)
      : 0;
  const xp = studentProfile?.xp ?? 50 + completedCount * 25;
  const streak = studentProfile?.streakDays ?? 1;
  const badges = studentProfile?.badges ?? ['First Step'];

  useEffect(() => {
    const loadExtras = async () => {
      if (!navigator.onLine || !profile) return;
      try {
        const [lbSnap, certSnap, repSnap] = await Promise.all([
          getDocs(query(collection(db, 'studentProfiles'), where('classNumber', '==', cls))),
          getDocs(query(collection(db, 'certificates'), where('userId', '==', profile.uid))),
          getDocs(query(collection(db, 'parentReports'), where('studentUid', '==', profile.uid))),
        ]);
        const lb = lbSnap.docs
          .map((d) => d.data() as StudentProfile)
          .sort((a, b) => b.xp - a.xp)
          .slice(0, 10);
        setLeaderboard(lb);
        setCertificates(certSnap.docs.map((d) => d.data() as CertificateRecord));
        if (!repSnap.empty) {
          const rep = repSnap.docs[0].data() as ParentReportRecord;
          setReportLink(`/parent-report/${rep.id}`);
        }
      } catch {
        // ignore offline errors
      }
    };
    void loadExtras();
  }, [cls, profile]);

  const handleIssueCertificate = async (subjectName: string) => {
    if (!profile || !isOnline) return;
    setBusy(true);
    const certId = `cert_${profile.uid}_${subjectName.replace(/[^a-zA-Z0-9]/g, '_')}`.slice(0, 140);
    const safeClass = Math.max(1, Math.min(10, Math.round(Number(cls) || 1)));
    const safeScore = Math.max(0, Math.min(100, Math.round(Number(avgQuiz) || 0)));
    const safeName = (profile.displayName || 'Student').slice(0, 100);
    const ref = doc(db, 'certificates', certId);
    try {
      const existingSnap = await getDoc(ref);
      if (existingSnap.exists()) {
        await updateDoc(ref, {
          studentName: safeName,
          classNumber: safeClass,
          courseTitle: `CBSE Class ${safeClass} ${subjectName}`.slice(0, 180),
          scorePercent: safeScore,
          issuedAt: serverTimestamp(),
        });
      } else {
        await setDoc(ref, {
          id: certId,
          userId: profile.uid,
          studentName: safeName,
          classNumber: safeClass,
          subjectName: subjectName.slice(0, 80),
          courseTitle: `CBSE Class ${safeClass} ${subjectName}`.slice(0, 180),
          scorePercent: safeScore,
          issuedAt: serverTimestamp(),
        });
      }
      setCertificates((prev) => [
        ...prev.filter((c) => c.id !== certId),
        {
          id: certId,
          userId: profile.uid,
          studentName: safeName,
          classNumber: safeClass,
          subjectName,
          courseTitle: `CBSE Class ${safeClass} ${subjectName}`,
          scorePercent: safeScore,
        },
      ]);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `certificates/${certId}`);
    } finally {
      setBusy(false);
    }
  };

  const handleGenerateParentReport = async () => {
    if (!profile || !isOnline) return;
    setBusy(true);
    const repId = `rep_${profile.uid}`;
    const ref = doc(db, 'parentReports', repId);
    try {
      const existingSnap = await getDoc(ref);
      if (existingSnap.exists()) {
        await updateDoc(ref, {
          lessonsCompleted: completedCount,
          avgQuizScore: avgQuiz,
          streakDays: streak,
          xp,
          active: true,
        });
      } else {
        await setDoc(ref, {
          id: repId,
          studentUid: profile.uid,
          studentName: (profile.displayName || 'Student').slice(0, 100),
          classNumber: cls,
          lessonsCompleted: completedCount,
          avgQuizScore: avgQuiz,
          streakDays: streak,
          xp,
          active: true,
          createdAt: serverTimestamp(),
        });
      }
      setReportLink(`/parent-report/${repId}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `parentReports/${repId}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Badges & Parent Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-slate-900">Earned Badges & XP</h2>
            <span className="font-mono text-sm font-bold text-indigo-700 tabular-nums">{xp} XP</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {badges.map((b) => (
              <div key={b} className="rounded-2xl border border-violet-200/70 bg-violet-50/50 p-3.5 flex items-center gap-2.5">
                <Trophy className="h-5 w-5 text-violet-700 shrink-0" />
                <span className="text-xs font-bold text-slate-900">{b}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 rounded-3xl border border-emerald-200/80 bg-emerald-50/40 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-emerald-700" />
            <h2 className="font-display text-lg font-bold text-slate-900">Parent Progress Report</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Create a shareable read-only snapshot showing your lessons completed, quiz average, and streak days.
          </p>
          <button
            type="button"
            disabled={busy || !isOnline}
            onClick={() => void handleGenerateParentReport()}
            className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 cursor-pointer"
          >
            {reportLink ? 'Refresh Parent Report Link' : 'Generate Parent Report Link'}
          </button>
          {reportLink && (
            <Link
              to={reportLink}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:underline"
            >
              <span>Open Shareable Parent Report</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Certificates + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-600" />
            <h2 className="font-display text-lg font-bold text-slate-900">Subject Completion Certificates</h2>
          </div>
          <div className="space-y-2.5">
            {subjects.map((sub) => {
              const issued = certificates.find((c) => c.subjectName === sub.name);
              return (
                <div key={sub.id} className="rounded-2xl border border-slate-200/80 bg-[#FAFBFD] px-4 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{sub.name}</p>
                    <p className="text-xs text-slate-500">
                      {issued ? `Issued · Score ${issued.scorePercent}%` : 'Available to claim'}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={busy || !isOnline}
                    onClick={() => void handleIssueCertificate(sub.name)}
                    className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 cursor-pointer"
                  >
                    {issued ? 'Update Certificate' : 'Claim Certificate'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-6 rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-600" />
            <h2 className="font-display text-lg font-bold text-slate-900">Class {cls} Leaderboard</h2>
          </div>
          {!isOnline ? (
            <p className="text-xs text-slate-500">Reconnect to view the live Class {cls} leaderboard.</p>
          ) : leaderboard.length === 0 ? (
            <p className="text-xs text-slate-500">No peers ranked in Class {cls} yet.</p>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((row, idx) => (
                <div
                  key={row.uid}
                  className={`rounded-2xl border px-4 py-3 flex items-center justify-between text-sm ${
                    row.uid === profile?.uid
                      ? 'border-indigo-300 bg-indigo-50/60 font-semibold'
                      : 'border-slate-100 bg-[#FAFBFD]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-500 w-5 tabular-nums">#{idx + 1}</span>
                    <span className="text-slate-900">{row.displayName}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-indigo-700 tabular-nums">
                    {row.xp} XP · {row.lessonsCompleted} lessons
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
