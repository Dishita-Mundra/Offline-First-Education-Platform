import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { Award, BookOpenCheck, Flame, Printer, Sparkles } from 'lucide-react';
import { Logo } from '../components/Logo';
import { SCHOOL_BRAND } from '../config/schoolImages';
import { db } from '../lib/firebase';
import type { ParentReportRecord } from '../types/curriculum';

export default function ParentReportPage() {
  const { reportId } = useParams<{ reportId: string }>();
  const [report, setReport] = useState<ParentReportRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!reportId) {
        setError('Invalid progress report link.');
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'parentReports', reportId));
        if (!snap.exists()) {
          setError('This progress report does not exist or has been deactivated.');
        } else {
          setReport(snap.data() as ParentReportRecord);
        }
      } catch {
        setError('Unable to load progress report right now.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [reportId]);

  return (
    <div className="min-h-screen bg-[#FAFBFD] py-10 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link to="/">
            <Logo />
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#0F2744] hover:bg-sky-50 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </button>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Loading parent progress report...
          </div>
        ) : error || !report ? (
          <div className="rounded-3xl border border-rose-200 bg-white p-10 text-center space-y-3">
            <h1 className="font-display text-xl font-bold text-[#0F2744]">Report Unavailable</h1>
            <p className="text-sm text-slate-600">{error}</p>
            <Link to="/" className="inline-block text-sm font-semibold text-[#0F2744] hover:underline">
              Return to {SCHOOL_BRAND.name}
            </Link>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                  {SCHOOL_BRAND.fullUpperName} · Parent Progress Report
                </p>
                <h1 className="mt-1 font-display text-2xl font-bold text-[#0F2744]">{report.studentName}</h1>
                <p className="text-sm text-slate-500">CBSE Class {report.classNumber} · {SCHOOL_BRAND.name}</p>
              </div>
              <div className="rounded-2xl bg-[#0F2744] text-white px-4 py-2.5 text-right">
                <p className="text-xs text-amber-300 font-medium">Total Learning XP</p>
                <p className="font-mono text-2xl font-bold tabular-nums">{report.xp}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-sky-50/75 border border-sky-200/75 p-4">
                <BookOpenCheck className="h-5 w-5 text-[#0F2744] mb-2" />
                <p className="font-mono text-2xl font-bold text-[#0F2744] tabular-nums">{report.lessonsCompleted}</p>
                <p className="text-xs text-slate-600">Lessons Completed</p>
              </div>
              <div className="rounded-2xl bg-sky-50/75 border border-sky-200/75 p-4">
                <Award className="h-5 w-5 text-[#1E3A5F] mb-2" />
                <p className="font-mono text-2xl font-bold text-[#0F2744] tabular-nums">{report.avgQuizScore}%</p>
                <p className="text-xs text-slate-600">Average Quiz Score</p>
              </div>
              <div className="rounded-2xl bg-amber-50/75 border border-amber-200/80 p-4">
                <Flame className="h-5 w-5 text-amber-600 mb-2" />
                <p className="font-mono text-2xl font-bold text-[#0F2744] tabular-nums">{report.streakDays} days</p>
                <p className="text-xs text-slate-600">Active Study Streak</p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#FAFBFD] border border-slate-200/80 p-5 flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700 leading-relaxed">
                This summary reflects verified offline and online learning progress synced from {SCHOOL_BRAND.name}. Consistent daily study and chapter quizzes help reinforce core CBSE concepts.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
