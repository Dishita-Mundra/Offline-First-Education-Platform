import { useEffect, useState } from 'react';
import {
  Bookmark,
  BookOpen,
  CheckCircle2,
  Download,
  FileText,
  Languages,
  PlayCircle,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ConceptVisualizer } from '../../components/ConceptVisualizer';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';
import {
  downloadChapterNotesDocument,
  getSubjectsForClass,
  searchCurriculum,
} from '../../curriculum/cbseCurriculum';
import { resolveAssetUrl } from '../../lib/api';
import { db } from '../../lib/firebase';
import type { CBSEChapter, CBSESubject, CourseRecord, LessonRecord } from '../../types/curriculum';

interface StudentLearningViewProps {
  onStartChapterQuiz: (chapter: CBSEChapter) => void;
}

const TINT_CARD: Record<CBSESubject['accentTint'], string> = {
  lavender: 'bg-violet-50/75 border-violet-200/80 hover:border-violet-300',
  blue: 'bg-sky-50/75 border-sky-200/80 hover:border-sky-300',
  mint: 'bg-emerald-50/75 border-emerald-200/80 hover:border-emerald-300',
  peach: 'bg-orange-50/75 border-orange-200/80 hover:border-orange-300',
};

export function StudentLearningView({ onStartChapterQuiz }: StudentLearningViewProps) {
  const { profile } = useAuth();
  const {
    isOnline,
    downloadedPackages,
    progressList,
    bookmarks,
    downloadChapter,
    removeChapterDownload,
    recordLessonComplete,
    toggleBookmark,
  } = useOffline();

  const [selectedClass, setSelectedClass] = useState<number>(profile?.classNumber ?? 10);
  const [selectedSubject, setSelectedSubject] = useState<CBSESubject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<CBSEChapter | null>(null);
  const [showHindi, setShowHindi] = useState<boolean>(profile?.preferredLanguage === 'Hindi');
  const [searchQuery, setSearchQuery] = useState('');
  const [customCourses, setCustomCourses] = useState<CourseRecord[]>([]);
  const [customLessons, setCustomLessons] = useState<LessonRecord[]>([]);
  const [activeCourseLesson, setActiveCourseLesson] = useState<LessonRecord | null>(null);

  useEffect(() => {
    setSelectedSubject(null);
    setSelectedChapter(null);
    setActiveCourseLesson(null);
  }, [selectedClass]);

  useEffect(() => {
    const loadCustomContent = async () => {
      if (!navigator.onLine) return;
      try {
        const [cSnap, lSnap] = await Promise.all([
          getDocs(
            query(
              collection(db, 'courses'),
              where('published', '==', true),
              where('classNumber', '==', selectedClass)
            )
          ),
          getDocs(query(collection(db, 'lessons'), where('classNumber', '==', selectedClass))),
        ]);
        setCustomCourses(cSnap.docs.map((d) => d.data() as CourseRecord));
        setCustomLessons(lSnap.docs.map((d) => d.data() as LessonRecord));
      } catch {
        // offline or index pending
      }
    };
    void loadCustomContent();
  }, [selectedClass]);

  const subjects = getSubjectsForClass(selectedClass);
  const searchResults = searchQuery.trim() ? searchCurriculum(searchQuery, undefined) : [];

  const isChapterDownloaded = (chapterId: string) => downloadedPackages.some((p) => p.id === chapterId);
  const isLessonCompleted = (lessonId: string) =>
    progressList.some((p) => p.lessonId === lessonId && p.completed);
  const isLessonBookmarked = (lessonId: string) =>
    bookmarks.some((b) => b.lessonId === lessonId);

  const handleOpenSearchResult = (res: ReturnType<typeof searchCurriculum>[number]) => {
    setSelectedClass(res.classNumber);
    const clsSubjects = getSubjectsForClass(res.classNumber);
    const foundSub = clsSubjects.find((s) => s.id === res.subjectId) ?? null;
    setSelectedSubject(foundSub);
    if (res.type === 'chapter' && foundSub) {
      const foundCh = foundSub.chapters.find((c) => c.id === res.id) ?? null;
      setSelectedChapter(foundCh);
    } else {
      setSelectedChapter(null);
    }
    setSearchQuery('');
  };

  if (activeCourseLesson) {
    const completed = isLessonCompleted(activeCourseLesson.id);
    const bookmarked = isLessonBookmarked(activeCourseLesson.id);
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setActiveCourseLesson(null)}
            className="text-sm font-semibold text-indigo-600 hover:underline cursor-pointer"
          >
            ← Back to Class {selectedClass} Subjects
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                void toggleBookmark({
                  lessonId: activeCourseLesson.id,
                  title: activeCourseLesson.title,
                  classNumber: activeCourseLesson.classNumber,
                  subjectName: activeCourseLesson.subjectName,
                })
              }
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold cursor-pointer ${
                bookmarked
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
            <button
              type="button"
              onClick={() =>
                void recordLessonComplete({
                  lessonId: activeCourseLesson.id,
                  classNumber: activeCourseLesson.classNumber,
                  subjectName: activeCourseLesson.subjectName,
                  chapterTitle: activeCourseLesson.chapterTitle,
                  timeSpentMinutes: 20,
                })
              }
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer ${
                completed
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{completed ? 'Completed' : 'Mark Lesson Complete'}</span>
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Teacher Published Lesson · Class {activeCourseLesson.classNumber} · {activeCourseLesson.subjectName}
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-slate-900">{activeCourseLesson.title}</h2>
            <p className="text-sm text-slate-500">{activeCourseLesson.chapterTitle}</p>
          </div>

          {activeCourseLesson.objectives && activeCourseLesson.objectives.length > 0 && (
            <div className="rounded-2xl bg-sky-50/70 border border-sky-200/70 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-sky-800 mb-2">Learning Objectives</p>
              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                {activeCourseLesson.objectives.map((obj, idx) => (
                  <li key={idx}>{obj}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {activeCourseLesson.content}
          </div>

          {(activeCourseLesson.videoUrl || activeCourseLesson.resourceUrl) && (
            <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
              {activeCourseLesson.videoUrl && (
                <a
                  href={resolveAssetUrl(activeCourseLesson.videoUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-2 text-xs font-semibold text-indigo-800 hover:bg-indigo-100"
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>Open Lesson Video</span>
                </a>
              )}
              {activeCourseLesson.resourceUrl && (
                <a
                  href={resolveAssetUrl(activeCourseLesson.resourceUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                >
                  <FileText className="h-4 w-4" />
                  <span>Open Attached Notes / PDF</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (selectedChapter) {
    const pkg = downloadedPackages.find((p) => p.id === selectedChapter.id);
    const completed = isLessonCompleted(selectedChapter.id);
    const bookmarked = isLessonBookmarked(selectedChapter.id);

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setSelectedChapter(null)}
            className="text-sm font-semibold text-indigo-600 hover:underline cursor-pointer"
          >
            ← Back to {selectedChapter.subjectName} Chapters
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {selectedChapter.hindiSummary && (
              <button
                type="button"
                onClick={() => setShowHindi((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold cursor-pointer ${
                  showHindi
                    ? 'border-orange-300 bg-orange-50 text-orange-800'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <Languages className="h-3.5 w-3.5" />
                <span>{showHindi ? 'Hindi Summary On' : 'Show Hindi Summary'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                void toggleBookmark({
                  lessonId: selectedChapter.id,
                  title: selectedChapter.title,
                  classNumber: selectedChapter.classNumber,
                  subjectName: selectedChapter.subjectName,
                })
              }
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold cursor-pointer ${
                bookmarked
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            {pkg ? (
              <button
                type="button"
                onClick={() => void removeChapterDownload(selectedChapter.id)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Saved Offline ({Math.max(1, Math.round(pkg.sizeBytes / 1024))} KB)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void downloadChapter(selectedChapter)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-800 hover:bg-sky-100 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Offline Pack</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => downloadChapterNotesDocument(selectedChapter)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Study Sheet</span>
            </button>

            <button
              type="button"
              onClick={() =>
                void recordLessonComplete({
                  lessonId: selectedChapter.id,
                  classNumber: selectedChapter.classNumber,
                  subjectName: selectedChapter.subjectName,
                  chapterTitle: selectedChapter.title,
                  timeSpentMinutes: selectedChapter.estimatedMinutes,
                })
              }
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer ${
                completed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{completed ? 'Lesson Completed' : 'Mark Complete (+25 XP)'}</span>
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                CBSE Class {selectedChapter.classNumber} · {selectedChapter.subjectName} · Chapter{' '}
                {selectedChapter.chapterNumber}
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-slate-900">{selectedChapter.title}</h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{selectedChapter.summary}</p>
            </div>
            <button
              type="button"
              onClick={() => onStartChapterQuiz(selectedChapter)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 cursor-pointer shrink-0"
            >
              <Sparkles className="h-4 w-4" />
              <span>Start Chapter Quiz ({selectedChapter.quizQuestions.length} Qs)</span>
            </button>
          </div>

          {showHindi && selectedChapter.hindiSummary && (
            <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-orange-800 mb-1">
                हिन्दी सारांश (Hindi Summary)
              </p>
              <p className="text-sm text-slate-800 leading-relaxed">{selectedChapter.hindiSummary}</p>
            </div>
          )}

          {/* Interactive Concept Sandbox */}
          <ConceptVisualizer chapter={selectedChapter} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-sky-200/70 bg-sky-50/40 p-5">
              <h3 className="font-display text-base font-bold text-slate-900 mb-2.5">Learning Objectives</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
                {selectedChapter.objectives.map((obj, idx) => (
                  <li key={idx}>{obj}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-violet-200/70 bg-violet-50/40 p-5">
              <h3 className="font-display text-base font-bold text-slate-900 mb-2.5">Quick Revision Points</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
                {selectedChapter.revisionPoints.map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold text-slate-900">Detailed Study Notes</h3>
            <div className="space-y-2.5">
              {selectedChapter.studyNotes.map((note, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200/80 bg-[#FAFBFD] p-4 text-sm text-slate-700 leading-relaxed">
                  {note}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold text-slate-900">Practice Questions & Answers</h3>
            <div className="space-y-3">
              {selectedChapter.practiceQuestions.map((qa, idx) => (
                <div key={idx} className="rounded-2xl border border-emerald-200/70 bg-emerald-50/35 p-4 space-y-1.5">
                  <p className="text-sm font-bold text-slate-900">
                    Q{idx + 1}. {qa.question}
                  </p>
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold text-emerald-800">Answer:</span> {qa.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search + Class Switcher */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search CBSE chapters, topics, formulas across Classes 1–10..."
              className="w-full rounded-xl border border-slate-200 bg-[#FAFBFD] pl-10 pr-4 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>
          <div className="text-xs text-slate-500 tabular-nums">
            Offline Vault: <span className="font-bold text-emerald-700">{downloadedPackages.length}</span> chapters cached
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-3 max-h-64 overflow-y-auto space-y-1.5">
            {searchResults.map((res) => (
              <button
                key={`${res.type}_${res.id}`}
                type="button"
                onClick={() => handleOpenSearchResult(res)}
                className="w-full text-left rounded-xl bg-white px-3.5 py-2.5 hover:bg-indigo-50 transition-colors flex items-center justify-between gap-3 cursor-pointer"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{res.title}</p>
                  <p className="text-xs text-slate-500">{res.subtitle}</p>
                </div>
                <span className="text-xs font-semibold text-indigo-600 shrink-0">Open →</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((cls) => (
            <button
              key={cls}
              type="button"
              onClick={() => setSelectedClass(cls)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold tabular-nums cursor-pointer transition-colors ${
                selectedClass === cls
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
              }`}
            >
              Class {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Detail or Subject Grid */}
      {selectedSubject ? (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setSelectedSubject(null)}
            className="text-sm font-semibold text-indigo-600 hover:underline cursor-pointer"
          >
            ← All Class {selectedClass} Subjects
          </button>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-semibold text-indigo-600">
                  Class {selectedSubject.classNumber} · {selectedSubject.category}
                </p>
                <h2 className="font-display text-2xl font-bold text-slate-900">{selectedSubject.name}</h2>
                <p className="text-sm text-slate-600 mt-1">{selectedSubject.description}</p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  for (const ch of selectedSubject.chapters) {
                    await downloadChapter(ch);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 cursor-pointer shrink-0"
              >
                <Download className="h-4 w-4" />
                <span>Download All Subject Chapters</span>
              </button>
            </div>

            <div className="space-y-3">
              {selectedSubject.chapters.map((ch) => {
                const downloaded = isChapterDownloaded(ch.id);
                const done = isLessonCompleted(ch.id);
                return (
                  <div
                    key={ch.id}
                    className="rounded-2xl border border-slate-200/80 bg-[#FAFBFD] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono font-semibold text-indigo-700">Chapter {ch.chapterNumber}</span>
                        <span>·</span>
                        <span className="tabular-nums">{ch.estimatedMinutes} mins</span>
                        <span>·</span>
                        <span className="tabular-nums">{ch.quizQuestions.length} Quiz Qs</span>
                        {downloaded && (
                          <>
                            <span>·</span>
                            <span className="text-emerald-700 font-semibold">Offline Ready</span>
                          </>
                        )}
                        {done && (
                          <>
                            <span>·</span>
                            <span className="text-indigo-700 font-semibold">Completed</span>
                          </>
                        )}
                      </div>
                      <h3 className="font-display text-lg font-bold text-slate-900">{ch.title}</h3>
                      <p className="text-xs text-slate-600">{ch.summary}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          downloaded ? void removeChapterDownload(ch.id) : void downloadChapter(ch)
                        }
                        className={`rounded-xl border px-3 py-2 text-xs font-semibold cursor-pointer ${
                          downloaded
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {downloaded ? 'Saved Offline' : 'Download'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedChapter(ch)}
                        className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
                      >
                        Study Chapter
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjects.map((sub) => {
              const completedInSub = sub.chapters.filter((ch) => isLessonCompleted(ch.id)).length;
              const downloadedInSub = sub.chapters.filter((ch) => isChapterDownloaded(ch.id)).length;
              return (
                <div
                  key={sub.id}
                  className={`rounded-2xl border p-5 flex flex-col justify-between transition-colors ${TINT_CARD[sub.accentTint]}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-500">
                        Class {sub.classNumber} · {sub.category}
                      </p>
                      <BookOpen className="h-4 w-4 text-indigo-600 shrink-0" />
                    </div>
                    <h3 className="mt-1.5 font-display text-lg font-bold text-slate-900">{sub.name}</h3>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{sub.description}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-200/70 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-600 tabular-nums">
                      {completedInSub}/{sub.chapters.length} done · {downloadedInSub} offline
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedSubject(sub)}
                      className="rounded-xl bg-white border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 cursor-pointer"
                    >
                      Open Subject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Teacher-Published Custom Courses (when online) */}
          {isOnline && customCourses.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-slate-900">
                Teacher-Published Class {selectedClass} Courses
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customCourses.map((course) => {
                  const courseLessons = customLessons.filter((l) => l.courseId === course.id);
                  return (
                    <div key={course.id} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-indigo-600">
                          {course.subjectName} · By {course.teacherName}
                        </p>
                        <h4 className="font-display text-base font-bold text-slate-900">{course.title}</h4>
                        <p className="text-xs text-slate-600 mt-1">{course.description}</p>
                      </div>
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        {courseLessons.length === 0 ? (
                          <p className="text-xs text-slate-400">No lessons added yet.</p>
                        ) : (
                          courseLessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              type="button"
                              onClick={() => setActiveCourseLesson(lesson)}
                              className="w-full text-left rounded-xl bg-[#FAFBFD] px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-indigo-50 flex items-center justify-between cursor-pointer"
                            >
                              <span>{lesson.title}</span>
                              <span className="text-indigo-600">Read →</span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
