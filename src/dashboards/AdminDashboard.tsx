import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  Bell,
  BookOpen,
  CheckCircle2,
  KeyRound,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Users,
  XCircle,
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
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { db } from '../lib/firebase';
import type { CourseRecord, DiscussionRecord, UserProfile } from '../types/curriculum';

interface TeacherInvite {
  code: string;
  createdBy: string;
  used: boolean;
  usedBy?: string;
}

interface ContactMsg {
  id: string;
  name: string;
  email: string;
  message: string;
}

function mergeByKey<T>(primary: T[], secondary: T[], getKey: (item: T) => string): T[] {
  const map = new Map<string, T>();
  for (const item of secondary) map.set(getKey(item), item);
  for (const item of primary) map.set(getKey(item), item);
  return Array.from(map.values());
}

export default function AdminDashboard() {
  const { profile, firebaseUser, adminToken } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [invites, setInvites] = useState<TeacherInvite[]>([]);
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [discussions, setDiscussions] = useState<DiscussionRecord[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMsg[]>([]);

  const [customInviteCode, setCustomInviteCode] = useState('');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifSent, setNotifSent] = useState(false);
  const [actionBanner, setActionBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [busyUid, setBusyUid] = useState<string | null>(null);
  const [teacherFilter, setTeacherFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const authHeaders = useCallback((): HeadersInit => {
    if (!adminToken) return { 'Content-Type': 'application/json' };
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    };
  }, [adminToken]);

  const loadAdminData = useCallback(async () => {
    if (!profile || profile.role !== 'admin' || !navigator.onLine) return;

    let fsUsers: UserProfile[] = [];
    let fsInvites: TeacherInvite[] = [];
    let fsCourses: CourseRecord[] = [];
    let fsDiscussions: DiscussionRecord[] = [];
    let fsContacts: ContactMsg[] = [];

    if (firebaseUser) {
      try {
        const [uSnap, iSnap, cSnap, dSnap, mSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'teacherInvitations')),
          getDocs(collection(db, 'courses')),
          getDocs(query(collection(db, 'discussions'), where('classNumber', '>=', 1))),
          getDocs(collection(db, 'contactMessages')),
        ]);
        fsUsers = uSnap.docs.map((d) => d.data() as UserProfile);
        fsInvites = iSnap.docs.map((d) => d.data() as TeacherInvite);
        fsCourses = cSnap.docs.map((d) => d.data() as CourseRecord);
        fsDiscussions = dSnap.docs.map((d) => d.data() as DiscussionRecord);
        fsContacts = mSnap.docs.map((d) => d.data() as ContactMsg);
      } catch (err) {
        console.warn('Firestore admin read warning:', err);
      }
    }

    let apiUsers: UserProfile[] = [];
    let apiInvites: TeacherInvite[] = [];
    let apiCourses: CourseRecord[] = [];
    let apiContacts: ContactMsg[] = [];

    if (adminToken) {
      try {
        const headers = { Authorization: `Bearer ${adminToken}` };
        const [tRes, iRes, cRes, mRes] = await Promise.all([
          apiFetch('/api/admin/teachers', { headers }),
          apiFetch('/api/admin/invites', { headers }),
          apiFetch('/api/admin/courses', { headers }),
          apiFetch('/api/admin/contacts', { headers }),
        ]);

        if (tRes.ok) {
          const tData = (await tRes.json()) as { teachers?: Array<Partial<UserProfile> & { uid: string; email: string; displayName: string }> };
          apiUsers = (tData.teachers ?? []).map((t) => ({
            uid: t.uid,
            email: t.email,
            displayName: t.displayName,
            role: 'teacher',
            teacherStatus: t.teacherStatus ?? 'pending',
            classNumber: t.classNumber ?? 8,
            board: 'CBSE',
            preferredLanguage: t.preferredLanguage ?? 'English',
            dailyGoalMinutes: 45,
            specialization: t.specialization,
            inviteCodeUsed: t.inviteCodeUsed,
          }));
        }
        if (iRes.ok) {
          const iData = (await iRes.json()) as { invites?: TeacherInvite[] };
          apiInvites = iData.invites ?? [];
        }
        if (cRes.ok) {
          const cData = (await cRes.json()) as { courses?: CourseRecord[] };
          apiCourses = cData.courses ?? [];
        }
        if (mRes.ok) {
          const mData = (await mRes.json()) as { contacts?: ContactMsg[] };
          apiContacts = mData.contacts ?? [];
        }
      } catch (err) {
        console.warn('Backend admin API load warning:', err);
      }
    }

    // Backend teacher status is authoritative when present
    setUsers(mergeByKey(apiUsers, fsUsers, (u) => u.uid));
    setInvites(mergeByKey(apiInvites, fsInvites, (i) => i.code));
    setCourses(mergeByKey(apiCourses, fsCourses, (c) => c.id));
    setDiscussions(fsDiscussions);
    setContactMessages(mergeByKey(apiContacts, fsContacts, (m) => m.id));
  }, [profile, firebaseUser, adminToken]);

  useEffect(() => {
    void loadAdminData();
  }, [loadAdminData]);

  const handleTeacherDecision = async (user: UserProfile, decision: 'approved' | 'rejected') => {
    setActionBanner(null);
    setBusyUid(user.uid);
    try {
      let updatedViaApi = false;
      if (adminToken) {
        const res = await apiFetch(`/api/admin/teachers/${encodeURIComponent(user.uid)}/status`, {
          method: 'PATCH',
          headers: authHeaders(),
          body: JSON.stringify({ status: decision }),
        });
        if (!res.ok) {
          const errJson = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(errJson.error || 'Failed to update teacher status on server.');
        }
        updatedViaApi = true;
      }

      if (firebaseUser) {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            role: user.role,
            teacherStatus: decision,
            classNumber: user.classNumber,
            preferredLanguage: user.preferredLanguage,
            updatedAt: serverTimestamp(),
          });
        } catch (fsErr) {
          if (!updatedViaApi) throw fsErr;
        }
      }

      setActionBanner({
        type: 'success',
        text:
          decision === 'approved'
            ? `${user.displayName} has been approved and can now access the Faculty Studio.`
            : `${user.displayName}'s faculty request has been marked as rejected.`,
      });
      await loadAdminData();
    } catch (err) {
      setActionBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Unable to update teacher approval status.',
      });
    } finally {
      setBusyUid(null);
    }
  };

  const handleCreateInvite = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setActionBanner(null);
    const raw = customInviteCode.trim().replace(/[^a-zA-Z0-9_-]/g, '');
    const code = raw.length >= 6 ? raw : `IASTEACH_${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    try {
      if (adminToken) {
        const res = await apiFetch('/api/admin/invites', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ code }),
        });
        if (!res.ok) {
          const errJson = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(errJson.error || 'Unable to create invitation code.');
        }
      }

      if (firebaseUser) {
        await setDoc(doc(db, 'teacherInvitations', code), {
          code,
          createdBy: profile.uid,
          used: false,
          createdAt: serverTimestamp(),
        }).catch(() => undefined);
      }

      setCustomInviteCode('');
      setActionBanner({ type: 'success', text: `Invitation code ${code} generated.` });
      await loadAdminData();
    } catch (err) {
      setActionBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to generate invite code.',
      });
    }
  };

  const handleDeleteInvite = async (code: string) => {
    setActionBanner(null);
    try {
      if (adminToken) {
        await apiFetch(`/api/admin/invites/${encodeURIComponent(code)}`, {
          method: 'DELETE',
          headers: authHeaders(),
        });
      }
      if (firebaseUser) {
        await deleteDoc(doc(db, 'teacherInvitations', code)).catch(() => undefined);
      }
      await loadAdminData();
    } catch (err) {
      setActionBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Unable to delete invite code.',
      });
    }
  };

  const handleToggleCourse = async (course: CourseRecord) => {
    try {
      if (adminToken) {
        await apiFetch(`/api/admin/courses/${encodeURIComponent(course.id)}/toggle`, {
          method: 'PATCH',
          headers: authHeaders(),
          body: JSON.stringify({ published: !course.published }),
        });
      }
      if (firebaseUser) {
        await updateDoc(doc(db, 'courses', course.id), {
          published: !course.published,
          updatedAt: serverTimestamp(),
        }).catch(() => undefined);
      }
      await loadAdminData();
    } catch (err) {
      setActionBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Unable to update course status.',
      });
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      if (adminToken) {
        await apiFetch(`/api/admin/courses/${encodeURIComponent(courseId)}`, {
          method: 'DELETE',
          headers: authHeaders(),
        });
      }
      if (firebaseUser) {
        await deleteDoc(doc(db, 'courses', courseId)).catch(() => undefined);
      }
      await loadAdminData();
    } catch (err) {
      setActionBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Unable to delete course.',
      });
    }
  };

  const handleClearReport = async (disc: DiscussionRecord) => {
    if (!firebaseUser) return;
    try {
      await updateDoc(doc(db, 'discussions', disc.id), {
        reported: false,
        updatedAt: serverTimestamp(),
      });
      await loadAdminData();
    } catch (err) {
      setActionBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Unable to clear discussion flag.',
      });
    }
  };

  const handleDeleteDiscussion = async (discId: string) => {
    if (!firebaseUser) return;
    try {
      await deleteDoc(doc(db, 'discussions', discId));
      await loadAdminData();
    } catch (err) {
      setActionBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Unable to delete discussion.',
      });
    }
  };

  const handleBroadcastNotification = async (e: FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;
    const id = `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    try {
      if (adminToken) {
        const res = await apiFetch('/api/admin/announcements', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            title: notifTitle.trim(),
            message: notifMessage.trim(),
          }),
        });
        if (!res.ok) {
          const errJson = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(errJson.error || 'Failed to publish announcement.');
        }
      }
      if (firebaseUser) {
        await setDoc(doc(db, 'notifications', id), {
          id,
          userId: 'all',
          title: notifTitle.trim(),
          message: notifMessage.trim(),
          type: 'announcement',
          createdAt: serverTimestamp(),
        }).catch(() => undefined);
      }
      setNotifTitle('');
      setNotifMessage('');
      setNotifSent(true);
      setTimeout(() => setNotifSent(false), 3000);
    } catch (err) {
      setActionBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to send announcement.',
      });
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      if (adminToken) {
        await apiFetch(`/api/admin/contacts/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: authHeaders(),
        });
      }
      if (firebaseUser) {
        await deleteDoc(doc(db, 'contactMessages', id)).catch(() => undefined);
      }
      await loadAdminData();
    } catch (err) {
      setActionBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Unable to delete contact message.',
      });
    }
  };

  const allTeachers = users.filter((u) => u.role === 'teacher');
  const pendingTeachers = allTeachers.filter((u) => u.teacherStatus === 'pending');
  const approvedTeachers = allTeachers.filter((u) => u.teacherStatus === 'approved');
  const rejectedTeachers = allTeachers.filter((u) => u.teacherStatus === 'rejected');
  const students = users.filter((u) => u.role === 'student');
  const reportedDiscussions = discussions.filter((d) => d.reported);

  const visibleTeachers =
    teacherFilter === 'all'
      ? allTeachers
      : allTeachers.filter((t) => t.teacherStatus === teacherFilter);

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'approvals', label: 'Teacher Approvals', icon: ShieldCheck, badge: pendingTeachers.length },
    { id: 'invites', label: 'Invite Codes', icon: KeyRound, badge: invites.filter((i) => !i.used).length },
    { id: 'users', label: 'Users Directory', icon: Users, badge: users.length },
    { id: 'moderation', label: 'Content Moderation', icon: MessageSquare, badge: reportedDiscussions.length },
    { id: 'broadcast', label: 'Announcements & Inbox', icon: Bell, badge: contactMessages.length },
  ];

  return (
    <DashboardLayout
      roleLabel="Indo American School · Admin Control"
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerActions={
        <button
          type="button"
          onClick={() => void loadAdminData()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-sky-50 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </button>
      }
    >
      {actionBanner && (
        <div
          className={`mb-5 rounded-2xl border px-4 py-3 text-sm flex items-center justify-between gap-3 ${
            actionBanner.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-800'
          }`}
        >
          <span>{actionBanner.text}</span>
          <button
            type="button"
            onClick={() => setActionBanner(null)}
            className="text-xs font-semibold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-sky-200/70 bg-sky-50/70 p-5">
              <Users className="h-5 w-5 text-[#0F2744] mb-2" />
              <p className="font-mono text-2xl font-bold text-[#0F2744] tabular-nums">{students.length}</p>
              <p className="text-xs text-slate-600">CBSE Students</p>
            </div>
            <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-5">
              <ShieldCheck className="h-5 w-5 text-emerald-700 mb-2" />
              <p className="font-mono text-2xl font-bold text-[#0F2744] tabular-nums">{approvedTeachers.length}</p>
              <p className="text-xs text-slate-600">
                Approved Teachers · {pendingTeachers.length} Pending
              </p>
            </div>
            <div className="rounded-2xl border border-blue-200/70 bg-blue-50/60 p-5">
              <BookOpen className="h-5 w-5 text-blue-700 mb-2" />
              <p className="font-mono text-2xl font-bold text-[#0F2744] tabular-nums">{courses.length}</p>
              <p className="text-xs text-slate-600">Teacher Courses</p>
            </div>
            <div className="rounded-2xl border border-amber-200/70 bg-amber-50/60 p-5">
              <Mail className="h-5 w-5 text-amber-600 mb-2" />
              <p className="font-mono text-2xl font-bold text-[#0F2744] tabular-nums">{contactMessages.length}</p>
              <p className="text-xs text-slate-600">Contact Messages · {reportedDiscussions.length} Flags</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-[#0F2744]">Pending Teacher Requests</h2>
              {allTeachers.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('approvals')}
                  className="text-xs font-semibold text-[#0F2744] hover:underline cursor-pointer"
                >
                  Open Full Approval Queue
                </button>
              )}
            </div>
            {pendingTeachers.length === 0 ? (
              <p className="text-xs text-slate-500">All teacher applications have been reviewed.</p>
            ) : (
              pendingTeachers.map((t) => (
                <div
                  key={t.uid}
                  className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.displayName}</p>
                    <p className="text-xs text-slate-600">
                      {t.email} · Class {t.classNumber} · {t.specialization ?? 'General CBSE'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={busyUid === t.uid}
                      onClick={() => void handleTeacherDecision(t, 'approved')}
                      className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={busyUid === t.uid}
                      onClick={() => void handleTeacherDecision(t, 'rejected')}
                      className="rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-60 cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-[#0F2744]">Teacher Approval Management</h2>
              <p className="text-xs text-slate-500">
                Review pending faculty registrations and grant or revoke Faculty Studio access.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {(
                [
                  { id: 'all', label: `All (${allTeachers.length})` },
                  { id: 'pending', label: `Pending (${pendingTeachers.length})` },
                  { id: 'approved', label: `Approved (${approvedTeachers.length})` },
                  { id: 'rejected', label: `Rejected (${rejectedTeachers.length})` },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setTeacherFilter(f.id)}
                  className={`rounded-xl px-3 py-1.5 font-semibold border transition-colors cursor-pointer ${
                    teacherFilter === f.id
                      ? 'bg-[#0F2744] text-white border-[#0F2744]'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-sky-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {visibleTeachers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 py-10 text-center text-xs text-slate-500">
              No teacher accounts match this filter yet.
            </div>
          ) : (
            <div className="space-y-3">
              {visibleTeachers.map((t) => (
                <div
                  key={t.uid}
                  className="rounded-2xl border border-slate-200/80 bg-[#FAFBFD] p-4 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-[#0F2744]">{t.displayName}</p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                          t.teacherStatus === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.teacherStatus === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.teacherStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {t.email} · Class {t.classNumber} · {t.specialization ?? 'General CBSE'} · {t.preferredLanguage}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={busyUid === t.uid || t.teacherStatus === 'approved'}
                      onClick={() => void handleTeacherDecision(t, 'approved')}
                      className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      type="button"
                      disabled={busyUid === t.uid || t.teacherStatus === 'rejected'}
                      onClick={() => void handleTeacherDecision(t, 'rejected')}
                      className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50 cursor-pointer"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'invites' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onSubmit={handleCreateInvite} className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 space-y-4 h-fit">
            <h2 className="font-display text-lg font-bold text-[#0F2744]">Generate Teacher Invite Code</h2>
            <input
              type="text"
              value={customInviteCode}
              onChange={(e) => setCustomInviteCode(e.target.value)}
              placeholder="Optional custom code (min 6 chars) or leave blank"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-mono focus:border-[#0F2744] focus:outline-none"
            />
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F2744] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1E3A5F] cursor-pointer"
            >
              <Plus className="h-4 w-4 text-amber-300" />
              <span>Generate Invitation Code</span>
            </button>
          </form>

          <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 space-y-3">
            <h3 className="font-display text-base font-bold text-[#0F2744]">Invitation Codes ({invites.length})</h3>
            {invites.length === 0 ? (
              <p className="text-xs text-slate-500">No invitation codes created yet.</p>
            ) : (
              invites.map((inv) => (
                <div key={inv.code} className="rounded-2xl border border-slate-200/80 bg-[#FAFBFD] px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm font-bold text-[#0F2744]">{inv.code}</p>
                    <p className="text-xs text-slate-500">{inv.used ? `Used by ${inv.usedBy}` : 'Available for teacher signup'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDeleteInvite(inv.code)}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    aria-label={`Delete invite ${inv.code}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-[#0F2744]">Registered Accounts ({users.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Class</th>
                  <th className="py-2">Language</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.uid}>
                    <td className="py-2.5 pr-4 font-semibold text-slate-900">{u.displayName}</td>
                    <td className="py-2.5 pr-4 text-slate-600">{u.email}</td>
                    <td className="py-2.5 pr-4 capitalize font-semibold text-[#0F2744]">{u.role}</td>
                    <td className="py-2.5 pr-4 capitalize text-slate-600">
                      {u.role === 'teacher' ? u.teacherStatus : 'active'}
                    </td>
                    <td className="py-2.5 pr-4 font-mono tabular-nums">Class {u.classNumber}</td>
                    <td className="py-2.5">{u.preferredLanguage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'moderation' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3">
            <h2 className="font-display text-lg font-bold text-[#0F2744]">Courses Moderation ({courses.length})</h2>
            {courses.length === 0 ? (
              <p className="text-xs text-slate-500">No teacher-published courses yet.</p>
            ) : (
              courses.map((c) => (
                <div key={c.id} className="rounded-2xl border border-slate-200/80 bg-[#FAFBFD] p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#0F2744] font-semibold">Class {c.classNumber} · {c.teacherName}</p>
                    <p className="text-sm font-bold text-slate-900">{c.title}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => void handleToggleCourse(c)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold cursor-pointer"
                    >
                      {c.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeleteCourse(c.id)}
                      className="text-rose-600 p-1.5 cursor-pointer"
                      aria-label={`Delete course ${c.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3">
            <h2 className="font-display text-lg font-bold text-[#0F2744]">
              Reported Forum Threads ({reportedDiscussions.length})
            </h2>
            {reportedDiscussions.length === 0 ? (
              <p className="text-xs text-slate-500">No flagged threads right now.</p>
            ) : (
              reportedDiscussions.map((d) => (
                <div key={d.id} className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 space-y-2">
                  <p className="text-sm font-bold text-slate-900">{d.title}</p>
                  <p className="text-xs text-slate-600">{d.body}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => void handleClearReport(d)}
                      className="rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold cursor-pointer"
                    >
                      Dismiss Flag
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeleteDiscussion(d.id)}
                      className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
                    >
                      Delete Thread
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onSubmit={handleBroadcastNotification} className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 space-y-4 h-fit">
            <h2 className="font-display text-lg font-bold text-[#0F2744]">Broadcast Platform Announcement</h2>
            <input
              type="text"
              required
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
              placeholder="Announcement Title"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#0F2744] focus:outline-none"
            />
            <textarea
              rows={4}
              required
              value={notifMessage}
              onChange={(e) => setNotifMessage(e.target.value)}
              placeholder="Message shown to all students and teachers..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#0F2744] focus:outline-none"
            />
            {notifSent && <p className="text-xs font-semibold text-emerald-700">Announcement sent to all users!</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#0F2744] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1E3A5F] cursor-pointer"
            >
              Send Announcement
            </button>
          </form>

          <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 space-y-3">
            <h3 className="font-display text-base font-bold text-[#0F2744]">Contact Form Messages ({contactMessages.length})</h3>
            {contactMessages.length === 0 ? (
              <p className="text-xs text-slate-500">No contact inquiries yet.</p>
            ) : (
              contactMessages.map((m) => (
                <div key={m.id} className="rounded-2xl border border-slate-200/80 bg-[#FAFBFD] p-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {m.name} · <span className="font-normal text-[#0F2744]">{m.email}</span>
                    </p>
                    <p className="mt-1 text-xs text-slate-600">{m.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDeleteContact(m.id)}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    aria-label="Delete message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

