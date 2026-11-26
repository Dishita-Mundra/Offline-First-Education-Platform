import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, RotateCcw, Trophy, XCircle } from 'lucide-react';
import { useOffline } from '../context/OfflineContext';
import type { QuizAttemptRecord, QuizQuestion } from '../types/curriculum';

interface SmartQuizRunnerProps {
  quizId: string;
  quizTitle: string;
  classNumber: number;
  subjectName: string;
  chapterId?: string;
  timeLimitMinutes: number;
  passingScore: number;
  questions: QuizQuestion[];
  onExit: () => void;
}

export function SmartQuizRunner({
  quizId,
  quizTitle,
  classNumber,
  subjectName,
  chapterId,
  timeLimitMinutes,
  passingScore,
  questions,
  onExit,
}: SmartQuizRunnerProps) {
  const { submitQuizAttempt, isOnline } = useOffline();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(timeLimitMinutes * 60);
  const [submittedAttempt, setSubmittedAttempt] = useState<QuizAttemptRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFinishQuiz = async () => {
    if (submitting || submittedAttempt) return;
    setSubmitting(true);
    let score = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        score += 1;
      }
    });
    const attempt = await submitQuizAttempt({
      quizId,
      quizTitle,
      classNumber,
      subjectName,
      chapterId,
      score,
      totalQuestions: questions.length,
      passingScore,
    });
    setSubmittedAttempt(attempt);
    setSubmitting(false);
  };

  useEffect(() => {
    if (submittedAttempt) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          void handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedAttempt]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const currentQuestion = questions[currentIdx];

  if (submittedAttempt) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Quiz Completed · {submittedAttempt.attemptedOffline ? 'Saved Offline' : 'Synced'}
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-slate-900">{quizTitle}</h2>
            </div>
            <div
              className={`rounded-2xl px-5 py-3 text-center ${
                submittedAttempt.passed ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800'
              }`}
            >
              <p className="font-mono text-2xl font-bold tabular-nums">{submittedAttempt.percentage}%</p>
              <p className="text-xs font-semibold">
                {submittedAttempt.score} / {submittedAttempt.totalQuestions} Correct
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Trophy className={`h-5 w-5 ${submittedAttempt.passed ? 'text-emerald-600' : 'text-amber-600'}`} />
              <span>
                {submittedAttempt.passed
                  ? 'Great mastery! You cleared the passing benchmark.'
                  : 'Keep practicing! Review the explanations below and try again.'}
              </span>
            </div>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setCurrentIdx(0);
                  setSecondsLeft(timeLimitMinutes * 60);
                  setSubmittedAttempt(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Retake Quiz</span>
              </button>
              <button
                type="button"
                onClick={onExit}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Explanations */}
        <div className="space-y-3">
          {questions.map((q, idx) => {
            const chosen = answers[idx];
            const isCorrect = chosen === q.correctIndex;
            return (
              <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-bold text-slate-900">
                    Q{idx + 1}. {q.question}
                  </p>
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-600">
                  Your answer:{' '}
                  <span className={isCorrect ? 'font-semibold text-emerald-700' : 'font-semibold text-rose-700'}>
                    {chosen !== undefined ? q.options[chosen] : 'Not answered'}
                  </span>
                  {!isCorrect && (
                    <>
                      {' · '}Correct answer:{' '}
                      <span className="font-semibold text-emerald-700">{q.options[q.correctIndex]}</span>
                    </>
                  )}
                </p>
                <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-900">Explanation:</span> {q.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-semibold text-indigo-600">
              Class {classNumber} · {subjectName} {!isOnline ? '· Offline Quiz Mode' : ''}
            </p>
            <h2 className="font-display text-xl font-bold text-slate-900">{quizTitle}</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3.5 py-2 text-sm font-mono font-bold text-indigo-800 tabular-nums">
            <Clock className="h-4 w-4" />
            <span>{formattedTime}</span>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 tabular-nums">
            Question {currentIdx + 1} of {questions.length}
          </p>
          <h3 className="text-lg font-bold text-slate-900 leading-snug">{currentQuestion.question}</h3>

          <div className="space-y-2.5 pt-2">
            {currentQuestion.options.map((opt, optIdx) => {
              const selected = answers[currentIdx] === optIdx;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }))}
                  className={`w-full text-left rounded-2xl border px-4 py-3.5 text-sm transition-colors cursor-pointer flex items-center gap-3 ${
                    selected
                      ? 'border-indigo-600 bg-indigo-50/70 font-semibold text-indigo-950'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span
                    className={`h-6 w-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                      selected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onExit}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Exit Quiz
          </button>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            {currentIdx < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
                className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 cursor-pointer"
              >
                Next Question
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handleFinishQuiz()}
                disabled={submitting}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Question Palette */}
      <div className="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs h-fit space-y-4">
        <p className="text-sm font-bold text-slate-900">Question Palette</p>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, idx) => {
            const answered = answers[idx] !== undefined;
            const active = idx === currentIdx;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`h-10 rounded-xl font-mono text-xs font-bold tabular-nums transition-colors cursor-pointer ${
                  active
                    ? 'bg-indigo-600 text-white'
                    : answered
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
          <p className="tabular-nums">
            Answered: {Object.keys(answers).length} / {questions.length}
          </p>
          <p className="tabular-nums">Passing Score: {passingScore}%</p>
        </div>
      </div>
    </div>
  );
}
