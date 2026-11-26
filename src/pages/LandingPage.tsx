import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CloudOff,
  Compass,
  Download,
  FileCheck2,
  Globe,
  GraduationCap,
  Layers,
  Mail,
  Menu,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  WifiOff,
  X,
} from 'lucide-react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Logo } from '../components/Logo';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { SCHOOL_BRAND, SCHOOL_IMAGES } from '../config/schoolImages';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { CBSE_CURRICULUM, getClassData } from '../curriculum/cbseCurriculum';
import { apiFetch } from '../lib/api';
import { db } from '../lib/firebase';
import type { CBSESubject } from '../types/curriculum';

const ACCENT_SURFACE: Record<CBSESubject['accentTint'], string> = {
  lavender: 'bg-sky-50/75 border-sky-200/80',
  blue: 'bg-blue-50/75 border-blue-200/80',
  mint: 'bg-slate-50/80 border-sky-200/70',
  peach: 'bg-amber-50/65 border-amber-200/80',
};

export default function LandingPage() {
  const { profile } = useAuth();
  const { isOnline } = useOffline();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<number>(10);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactFeedback, setContactFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const activeClassData = getClassData(selectedClass) ?? CBSE_CURRICULUM[0];
  const portalPath =
    profile?.role === 'admin' ? '/admin' : profile?.role === 'teacher' ? '/teacher' : profile ? '/student' : '/login';

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setContactFeedback(null);

    if (contactName.trim().length < 2 || !contactEmail.includes('@') || contactMessage.trim().length < 5) {
      setContactFeedback({
        type: 'error',
        text: 'Please enter your name, a valid email address, and a message of at least 5 characters.',
      });
      return;
    }

    if (!navigator.onLine) {
      setContactFeedback({
        type: 'error',
        text: 'You appear to be offline. Please reconnect to send your message.',
      });
      return;
    }

    setContactSubmitting(true);
    try {
      const msgId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      await Promise.allSettled([
        setDoc(doc(db, 'contactMessages', msgId), {
          id: msgId,
          name: contactName.trim(),
          email: contactEmail.trim(),
          message: contactMessage.trim(),
          createdAt: serverTimestamp(),
        }),
        apiFetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: contactName.trim(),
            email: contactEmail.trim(),
            message: contactMessage.trim(),
          }),
        }),
      ]);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setContactFeedback({
        type: 'success',
        text: `Thank you! Your message has been sent to the ${SCHOOL_BRAND.name} academic team.`,
      });
    } catch {
      setContactFeedback({
        type: 'error',
        text: 'Unable to submit message right now. Please try again shortly.',
      });
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-slate-900">
      {/* 3-Zone Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to="/" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#about" className="hover:text-[#0F2744] transition-colors whitespace-nowrap">
              About
            </a>
            <a href="#features" className="hover:text-[#0F2744] transition-colors whitespace-nowrap">
              Features
            </a>
            <a href="#classes" className="hover:text-[#0F2744] transition-colors whitespace-nowrap">
              Classes 1–10
            </a>
            <a href="#how-it-works" className="hover:text-[#0F2744] transition-colors whitespace-nowrap">
              How It Works
            </a>
            <a href="#contact" className="hover:text-[#0F2744] transition-colors whitespace-nowrap">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to={portalPath}
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-[#0F2744] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#1E3A5F] transition-colors whitespace-nowrap shrink-0"
            >
              <span>{profile ? 'Open Portal' : 'Sign In / Join'}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-amber-300" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
            <div className="flex flex-col space-y-2.5 text-sm font-medium text-slate-700">
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-1">About</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-1">Features</a>
              <a href="#classes" onClick={() => setMobileMenuOpen(false)} className="py-1">Classes 1–10</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-1">How It Works</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-1">Contact</a>
            </div>
            <Link
              to={portalPath}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F2744] px-4 py-2.5 text-sm font-semibold text-white"
            >
              <span>{profile ? 'Open Portal' : 'Sign In / Join'}</span>
              <ArrowRight className="h-4 w-4 text-amber-300" />
            </Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/85 via-[#FAFBFD] to-[#FAFBFD] pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                {SCHOOL_BRAND.fullUpperName} · CBSE Classes 1 to 10
              </p>

              <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0F2744] leading-[1.12] text-balance">
                {SCHOOL_BRAND.tagline}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                {SCHOOL_BRAND.name} empowers CBSE students across Classes 1–10 to download complete chapter packages,
                explore interactive academic labs, attempt quizzes offline, and automatically sync progress when connectivity returns.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to={portalPath}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0F2744] px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1E3A5F] transition-colors whitespace-nowrap shrink-0"
                >
                  <GraduationCap className="h-4 w-4 shrink-0 text-amber-300" />
                  <span>{profile ? 'Go to Dashboard' : 'Enter School Portal'}</span>
                </Link>
                <PWAInstallButton variant="secondary" />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/80 max-w-lg">
                <div>
                  <p className="font-mono text-2xl font-bold text-[#0F2744] tabular-nums">1–10</p>
                  <p className="text-xs text-slate-500 mt-0.5">CBSE Classes</p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-bold text-[#1E3A5F] tabular-nums">180+</p>
                  <p className="text-xs text-slate-500 mt-0.5">Chapter Modules</p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-bold text-amber-600 tabular-nums">100%</p>
                  <p className="text-xs text-slate-500 mt-0.5">Offline Quiz Ready</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl border border-sky-200/80 bg-white p-3 shadow-lg shadow-slate-900/5">
                <div className={`aspect-[16/9] w-full overflow-hidden rounded-2xl ${SCHOOL_IMAGES.heroCampus.fallbackBg}`}>
                  <img
                    src={SCHOOL_IMAGES.heroCampus.src}
                    alt={SCHOOL_IMAGES.heroCampus.alt}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl bg-sky-50/85 border border-sky-200/70 px-4 py-3 flex items-center gap-3">
                    <WifiOff className="h-5 w-5 text-[#0F2744] shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#0F2744]">IndexedDB Offline Vault</p>
                      <p className="text-xs text-slate-600">Notes, quizzes & progress saved locally</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 px-4 py-3 flex items-center gap-3">
                    <RefreshCw className="h-5 w-5 text-amber-700 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#0F2744]">
                        {isOnline ? 'Cloud Sync Active' : 'Offline Mode Ready'}
                      </p>
                      <p className="text-xs text-slate-600">Auto-uploads scores when back online</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 bg-white border-y border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <div className={`aspect-[4/3] overflow-hidden rounded-3xl border border-sky-200/80 ${SCHOOL_IMAGES.campusAbout.fallbackBg} shadow-sm`}>
                <img
                  src={SCHOOL_IMAGES.campusAbout.src}
                  alt={SCHOOL_IMAGES.campusAbout.alt}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="lg:col-span-7 space-y-5">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700">About {SCHOOL_BRAND.name}</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0F2744] tracking-tight text-balance">
                Global academic standards built for uninterrupted learning everywhere.
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {SCHOOL_BRAND.name} blends structured CBSE academics with resilient offline-first digital classrooms.
                Students can download study sheets, bilingual Hindi summaries, interactive concept labs, and full-length
                quizzes on campus or Wi-Fi and continue studying seamlessly at home without connectivity worries.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-2xl bg-sky-50/75 border border-sky-200/75 p-4">
                  <p className="text-sm font-bold text-[#0F2744]">Primary to Secondary Coverage</p>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Tailored syllabi across Primary (Classes 1–5), Middle (Classes 6–8), and Secondary (Classes 9–10).
                  </p>
                </div>
                <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4">
                  <p className="text-sm font-bold text-[#0F2744]">Student, Faculty & Admin Portals</p>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Complete academic workflow: lesson publishing, assignment grading, weak-topic analytics, and parent reports.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 bg-[#FAFBFD]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Campus & Digital Capabilities</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#0F2744] tracking-tight">
              Everything needed for uninterrupted CBSE mastery
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Download,
                tint: 'bg-sky-50 border-sky-200 text-[#0F2744]',
                title: 'One-Tap Offline Packages',
                body: 'Download any CBSE chapter package locally into IndexedDB or export a printable HTML study sheet for offline reading.',
              },
              {
                icon: FileCheck2,
                tint: 'bg-amber-50 border-amber-200 text-amber-700',
                title: 'Offline Smart Quizzes',
                body: 'Timed MCQ quizzes with question palettes, instant explanations, and idempotent queue sync when internet resumes.',
              },
              {
                icon: Compass,
                tint: 'bg-sky-50 border-sky-200 text-[#0F2744]',
                title: 'Interactive Concept Labs',
                body: 'Explore interactive number lines, geometry shapes, science concept flows, and bilingual English/Hindi summaries.',
              },
              {
                icon: Layers,
                tint: 'bg-amber-50 border-amber-200 text-amber-700',
                title: 'Smart Revision Planner',
                body: 'Automatic weak-topic detection flags chapters scoring under 70% and builds a personalized weekly study calendar.',
              },
              {
                icon: Users,
                tint: 'bg-sky-50 border-sky-200 text-[#0F2744]',
                title: 'Faculty Grading & Analytics',
                body: 'Approved school teachers publish custom lessons, create timed quizzes, grade student submissions, and export CSV reports.',
              },
              {
                icon: ShieldCheck,
                tint: 'bg-amber-50 border-amber-200 text-amber-700',
                title: 'Parent Progress Snapshots',
                body: 'Generate shareable read-only parent report links displaying streak days, XP earned, lessons completed, and quiz accuracy.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${item.tint}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-[#0F2744]">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Classes 1-10 Section */}
      <section id="classes" className="py-16 sm:py-20 bg-white border-y border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700">CBSE Syllabus Explorer</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#0F2744] tracking-tight">
                Structured curriculum for Classes 1 to 10
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              Select a class to inspect subjects, chapters, and sample quizzes.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {CBSE_CURRICULUM.map((cls) => (
              <button
                key={cls.classNumber}
                type="button"
                onClick={() => setSelectedClass(cls.classNumber)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold tabular-nums whitespace-nowrap transition-colors cursor-pointer ${
                  selectedClass === cls.classNumber
                    ? 'bg-[#0F2744] text-white shadow-xs'
                    : 'bg-sky-50 text-[#0F2744] hover:bg-sky-100'
                }`}
              >
                Class {cls.classNumber}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeClassData.subjects.map((sub) => (
                <div
                  key={sub.id}
                  className={`rounded-2xl border p-5 ${ACCENT_SURFACE[sub.accentTint]}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        Class {sub.classNumber} · {sub.category}
                      </p>
                      <h3 className="mt-1 font-display text-lg font-bold text-[#0F2744]">{sub.name}</h3>
                    </div>
                    <BookOpen className="h-5 w-5 text-amber-600 shrink-0" />
                  </div>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{sub.description}</p>
                  <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-1.5">
                    {sub.chapters.map((ch) => (
                      <div key={ch.id} className="flex items-center justify-between text-xs text-slate-700">
                        <span className="truncate pr-2">
                          Ch {ch.chapterNumber}: {ch.title}
                        </span>
                        <span className="font-mono text-slate-500 shrink-0 tabular-nums">
                          {ch.quizQuestions.length} Qs
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-[#FAFBFD] p-4">
                <div className={`aspect-[4/3] overflow-hidden rounded-xl ${SCHOOL_IMAGES.scienceLab.fallbackBg} mb-3`}>
                  <img
                    src={SCHOOL_IMAGES.scienceLab.src}
                    alt={SCHOOL_IMAGES.scienceLab.alt}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-sm font-bold text-[#0F2744]">{activeClassData.stage}</p>
                <p className="mt-1 text-xs text-slate-600">
                  {activeClassData.subjects.length} CBSE subjects ·{' '}
                  {activeClassData.subjects.reduce((acc, s) => acc + s.chapters.length, 0)} interactive chapters ready for offline download.
                </p>
                <Link
                  to={portalPath}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F2744] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1E3A5F] transition-colors"
                >
                  <span>Open Class {selectedClass} Lessons</span>
                  <ArrowRight className="h-4 w-4 text-amber-300" />
                </Link>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#FAFBFD] p-4">
                <div className={`aspect-[4/3] overflow-hidden rounded-xl ${SCHOOL_IMAGES.mathAcademy.fallbackBg} mb-3`}>
                  <img
                    src={SCHOOL_IMAGES.mathAcademy.src}
                    alt={SCHOOL_IMAGES.mathAcademy.alt}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-sm font-bold text-[#0F2744]">Bilingual English & Hindi Support</p>
                <p className="mt-1 text-xs text-slate-600">
                  Every chapter pairs English study notes with a Hindi overview summary for clearer concept retention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-[#FAFBFD]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Offline-First Workflow</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#0F2744] tracking-tight">
              Three reliable steps from download to cloud sync
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: Download,
                tint: 'bg-sky-50 border-sky-200/80',
                title: 'Download Chapter Packs',
                desc: 'Save CBSE study notes, practice Q&A, concept labs, and quizzes to IndexedDB while on campus Wi-Fi or mobile internet.',
              },
              {
                step: '02',
                icon: CloudOff,
                tint: 'bg-white border-amber-200/80',
                title: 'Study & Quiz Offline',
                desc: 'Study uninterrupted even without internet. Complete lessons, write personal notes, and submit timed quizzes anytime.',
              },
              {
                step: '03',
                icon: RefreshCw,
                tint: 'bg-sky-50 border-sky-200/80',
                title: 'Auto-Sync on Reconnect',
                desc: `The moment internet returns, ${SCHOOL_BRAND.name} replays your queued operations idempotently and updates XP & faculty dashboards.`,
              },
            ].map((card) => (
              <div key={card.step} className={`rounded-2xl border p-6 ${card.tint}`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-amber-700 tabular-nums">STEP {card.step}</span>
                  <card.icon className="h-5 w-5 text-[#0F2744]" />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-[#0F2744]">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20 bg-white border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700">School Admissions & Support</p>
              <h2 className="font-display text-3xl font-bold text-[#0F2744] tracking-tight">
                Connect with {SCHOOL_BRAND.name}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Questions about CBSE Classes 1–10 academics, teacher invitation codes, or student onboarding? Send our academic desk a direct message.
              </p>
              <div className="space-y-3 pt-2 text-sm text-slate-700">
                <p className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-[#0F2744]" />
                  <span>{SCHOOL_BRAND.supportEmail}</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Globe className="h-4 w-4 text-[#0F2744]" />
                  <span>{SCHOOL_BRAND.locationLabel}</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <span>PWA Installable on Android, Desktop & iOS</span>
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form
                onSubmit={handleContactSubmit}
                className="rounded-3xl border border-slate-200 bg-[#FAFBFD] p-6 sm:p-8 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Aarav Sharma"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0F2744] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="aarav@indoamericanschool.edu.in"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0F2744] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tell us your class, inquiry, or academic question..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0F2744] focus:outline-none"
                  />
                </div>

                {contactFeedback && (
                  <div
                    className={`rounded-xl px-4 py-3 text-sm flex items-center gap-2 ${
                      contactFeedback.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{contactFeedback.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0F2744] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1E3A5F] disabled:opacity-60 cursor-pointer"
                >
                  <Send className="h-4 w-4 text-amber-300" />
                  <span>{contactSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-[#0F2744] text-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" showTagline tone="light" />
          <div className="flex flex-wrap items-center gap-4 text-xs text-sky-100">
            <Link to="/login" className="hover:text-amber-300">Sign In</Link>
            <span>·</span>
            <Link to="/register" className="hover:text-amber-300">Register</Link>
            <span>·</span>
            <Link to="/admin-login" className="hover:text-amber-300 font-semibold">Admin Login</Link>
            <span>·</span>
            <span>CBSE Classes 1–10</span>
            <PWAInstallButton variant="compact" />
          </div>
        </div>
      </footer>
    </div>
  );
}
