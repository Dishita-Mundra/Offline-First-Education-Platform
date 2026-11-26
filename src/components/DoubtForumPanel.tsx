import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { CheckCircle2, Flag, MessageSquare, Send, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { getSubjectsForClass } from '../curriculum/cbseCurriculum';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import type { DiscussionRecord, DiscussionReplyRecord } from '../types/curriculum';

export function DoubtForumPanel() {
  const { profile } = useAuth();
  const { isOnline } = useOffline();

  const [classFilter, setClassFilter] = useState<number>(profile?.classNumber ?? 10);
  const [discussions, setDiscussions] = useState<DiscussionRecord[]>([]);
  const [selectedDisc, setSelectedDisc] = useState<DiscussionRecord | null>(null);
  const [replies, setReplies] = useState<DiscussionReplyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState(getSubjectsForClass(profile?.classNumber ?? 10)[0]?.name ?? 'Mathematics');
  const [newBody, setNewBody] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadDiscussions = useCallback(async () => {
    if (!navigator.onLine) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, 'discussions'), where('classNumber', '==', classFilter), orderBy('createdAt', 'desc'))
      );
      setDiscussions(snap.docs.map((d) => d.data() as DiscussionRecord));
    } catch {
      // Fallback query without composite index if index is not yet built
      try {
        const snap = await getDocs(query(collection(db, 'discussions'), where('classNumber', '==', classFilter)));
        setDiscussions(snap.docs.map((d) => d.data() as DiscussionRecord));
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'discussions');
      }
    } finally {
      setLoading(false);
    }
  }, [classFilter]);

  useEffect(() => {
    void loadDiscussions();
    const subs = getSubjectsForClass(classFilter);
    if (subs.length > 0) setNewSubject(subs[0].name);
  }, [classFilter, loadDiscussions]);

  const loadReplies = async (disc: DiscussionRecord) => {
    setSelectedDisc(disc);
    try {
      const snap = await getDocs(
        query(collection(db, 'discussions', disc.id, 'replies'), where('discussionId', '==', disc.id))
      );
      setReplies(snap.docs.map((d) => d.data() as DiscussionReplyRecord));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, `discussions/${disc.id}/replies`);
    }
  };

  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile || !isOnline) return;
    if (newTitle.trim().length < 3 || newBody.trim().length < 3) return;
    setSubmitting(true);
    const id = `disc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    try {
      await setDoc(doc(db, 'discussions', id), {
        id,
        userId: profile.uid,
        authorName: profile.displayName,
        authorRole: profile.role,
        classNumber: classFilter,
        subjectName: newSubject,
        title: newTitle.trim(),
        body: newBody.trim(),
        resolved: false,
        reported: false,
        replyCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setNewTitle('');
      setNewBody('');
      await loadDiscussions();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `discussions/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile || !selectedDisc || !isOnline || !replyBody.trim()) return;
    setSubmitting(true);
    const replyId = `rep_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const isTeacherAnswer =
      (profile.role === 'teacher' && profile.teacherStatus === 'approved') || profile.role === 'admin';
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'discussions', selectedDisc.id, 'replies', replyId), {
        id: replyId,
        discussionId: selectedDisc.id,
        userId: profile.uid,
        authorName: profile.displayName,
        authorRole: profile.role,
        body: replyBody.trim(),
        isTeacherAnswer,
        createdAt: serverTimestamp(),
      });
      batch.update(doc(db, 'discussions', selectedDisc.id), {
        replyCount: selectedDisc.replyCount + 1,
        updatedAt: serverTimestamp(),
      });
      await batch.commit();
      setReplyBody('');
      const updated = { ...selectedDisc, replyCount: selectedDisc.replyCount + 1 };
      await loadReplies(updated);
      await loadDiscussions();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `discussions/${selectedDisc.id}/replies/${replyId}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleResolved = async (disc: DiscussionRecord) => {
    if (!profile || !isOnline) return;
    try {
      await updateDoc(doc(db, 'discussions', disc.id), {
        resolved: !disc.resolved,
        updatedAt: serverTimestamp(),
      });
      await loadDiscussions();
      if (selectedDisc?.id === disc.id) {
        setSelectedDisc({ ...disc, resolved: !disc.resolved });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `discussions/${disc.id}`);
    }
  };

  const handleReport = async (disc: DiscussionRecord) => {
    if (!profile || !isOnline) return;
    try {
      await updateDoc(doc(db, 'discussions', disc.id), {
        reported: true,
        updatedAt: serverTimestamp(),
      });
      await loadDiscussions();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `discussions/${disc.id}`);
    }
  };

  if (!isOnline) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6 text-sm text-amber-900">
        The Doubt Discussion Forum requires an internet connection to load peer and teacher replies. You can still write personal study notes offline in your Digital Notebook.
      </div>
    );
  }

  const subjects = getSubjectsForClass(classFilter);
  const canModerate =
    profile?.role === 'admin' || (profile?.role === 'teacher' && profile.teacherStatus === 'approved');

  return (
    <div className="space-y-6">
      {/* Class Filter + Ask Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 space-y-4 h-fit">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold text-slate-900">Ask a CBSE Doubt</h2>
            <select
              value={classFilter}
              onChange={(e) => {
                setClassFilter(Number(e.target.value));
                setSelectedDisc(null);
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((c) => (
                <option key={c} value={c}>
                  Class {c}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Subject</label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Question Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Why is √2 irrational?"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Details</label>
              <textarea
                rows={3}
                required
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Explain where you got stuck..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>Post Doubt</span>
            </button>
          </form>
        </div>

        {/* Thread List & Thread Detail */}
        <div className="lg:col-span-7 space-y-4">
          {selectedDisc ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-5">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <button
                    type="button"
                    onClick={() => setSelectedDisc(null)}
                    className="text-xs font-semibold text-indigo-600 hover:underline mb-2 cursor-pointer"
                  >
                    ← All Class {classFilter} Doubts
                  </button>
                  <h3 className="font-display text-xl font-bold text-slate-900">{selectedDisc.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedDisc.subjectName} · Asked by {selectedDisc.authorName} ·{' '}
                    <span className={selectedDisc.resolved ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                      {selectedDisc.resolved ? 'Resolved' : 'Open'}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {(profile?.uid === selectedDisc.userId || canModerate) && (
                    <button
                      type="button"
                      onClick={() => void handleToggleResolved(selectedDisc)}
                      className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 cursor-pointer whitespace-nowrap"
                    >
                      {selectedDisc.resolved ? 'Reopen' : 'Mark Resolved'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => void handleReport(selectedDisc)}
                    className="rounded-xl border border-slate-200 p-1.5 text-slate-500 hover:text-rose-600 cursor-pointer"
                    title="Report post"
                  >
                    <Flag className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedDisc.body}</p>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Replies ({replies.length})
                </p>
                {replies.length === 0 ? (
                  <p className="text-xs text-slate-500 py-2">No replies yet. Be the first to help!</p>
                ) : (
                  replies.map((rep) => (
                    <div
                      key={rep.id}
                      className={`rounded-2xl border p-4 ${
                        rep.isTeacherAnswer
                          ? 'border-emerald-200 bg-emerald-50/50'
                          : 'border-slate-200/80 bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          {rep.authorName}
                          {rep.isTeacherAnswer && (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Teacher Answer
                            </span>
                          )}
                        </span>
                        <span className="text-slate-500 capitalize">{rep.authorRole}</span>
                      </div>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{rep.body}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleReplySubmit} className="flex gap-2 pt-2">
                <input
                  type="text"
                  required
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  placeholder="Write a helpful explanation..."
                  className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 cursor-pointer shrink-0"
                >
                  Reply
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-slate-900">Class {classFilter} Discussions</h3>
                <span className="font-mono text-xs text-slate-500 tabular-nums">{discussions.length} threads</span>
              </div>

              {loading ? (
                <p className="text-sm text-slate-500 py-6 text-center">Loading discussions...</p>
              ) : discussions.length === 0 ? (
                <p className="text-sm text-slate-500 py-8 text-center">
                  No doubts posted for Class {classFilter} yet. Start a thread on the left!
                </p>
              ) : (
                <div className="space-y-3">
                  {discussions.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => void loadReplies(d)}
                      className="w-full text-left rounded-2xl border border-slate-200/80 bg-[#FAFBFD] p-4 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{d.title}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {d.subjectName} · By {d.authorName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 text-xs">
                          {d.resolved && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                          <span className="inline-flex items-center gap-1 font-mono text-slate-600 tabular-nums">
                            <MessageSquare className="h-3.5 w-3.5" />
                            {d.replyCount}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
