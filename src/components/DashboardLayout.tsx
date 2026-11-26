import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CloudOff,
  LogOut,
  Menu,
  RefreshCw,
  Wifi,
  X,
  type LucideIcon,
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Logo } from './Logo';
import { PWAInstallButton } from './PWAInstallButton';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { apiFetch } from '../lib/api';
import { db } from '../lib/firebase';
import type { NotificationRecord } from '../types/curriculum';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string;
}

interface DashboardLayoutProps {
  roleLabel: string;
  navItems: NavItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  headerActions?: ReactNode;
  children: ReactNode;
}

export function DashboardLayout({
  roleLabel,
  navItems,
  activeTab,
  onTabChange,
  headerActions,
  children,
}: DashboardLayoutProps) {
  const { profile, logout } = useAuth();
  const { isOnline, isSyncing, pendingSyncCount, triggerManualSync } = useOffline();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!profile || !navigator.onLine) return;
      const combined: NotificationRecord[] = [];
      try {
        const res = await apiFetch('/api/announcements');
        if (res.ok) {
          const data = (await res.json()) as {
            announcements?: Array<{ id: string; title: string; message: string }>;
          };
          for (const item of data.announcements ?? []) {
            combined.push({
              id: item.id,
              userId: 'all',
              title: item.title,
              message: item.message,
              type: 'announcement',
            });
          }
        }
      } catch {
        // ignore transient errors
      }

      try {
        const [globalSnap, personalSnap] = await Promise.all([
          getDocs(query(collection(db, 'notifications'), where('userId', '==', 'all'))),
          getDocs(query(collection(db, 'notifications'), where('userId', '==', profile.uid))),
        ]);
        combined.push(
          ...globalSnap.docs.map((d) => d.data() as NotificationRecord),
          ...personalSnap.docs.map((d) => d.data() as NotificationRecord)
        );
      } catch {
        // ignore offline/transient errors for notifications popover
      }

      const unique = Array.from(new Map(combined.map((n) => [n.id, n])).values());
      setNotifications(unique.slice(0, 12));
    };
    void loadNotifications();
  }, [profile]);

  const handleSelectNav = (id: string) => {
    onTabChange(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-slate-900 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/35 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <Link to="/">
            <Logo size="sm" />
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden rounded-lg p-1 text-slate-500 hover:bg-slate-100 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-3.5 border-b border-slate-100 bg-sky-50/75">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">{roleLabel}</p>
          <p className="mt-0.5 text-sm font-bold text-[#0F2744] truncate">{profile?.displayName ?? 'Learner'}</p>
          <p className="text-xs text-slate-500 truncate">
            {profile?.board ?? 'CBSE'} · Class {profile?.classNumber ?? 1} · {profile?.preferredLanguage ?? 'English'}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectNav(item.id)}
                className={`w-full flex items-center justify-between gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#0F2744] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-sky-50/70 hover:text-[#0F2744]'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <item.icon className={`h-4 w-4 shrink-0 ${active ? 'text-amber-300' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.badge !== undefined && Number(item.badge) > 0 && (
                  <span
                    className={`font-mono text-[11px] px-2 py-0.5 rounded-full tabular-nums ${
                      active ? 'bg-[#1E3A5F] text-amber-200' : 'bg-sky-50 text-[#0F2744]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100 space-y-2">
          <PWAInstallButton variant="compact" className="w-full justify-center" />
          <button
            type="button"
            onClick={() => void logout()}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display text-lg font-bold text-slate-900">
              {navItems.find((n) => n.id === activeTab)?.label ?? 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {headerActions}

            {/* Real Connectivity & Sync Controls */}
            <div
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
                isOnline
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-amber-200 bg-amber-50 text-amber-800'
              }`}
            >
              {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <CloudOff className="h-3.5 w-3.5" />}
              <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
            </div>

            {pendingSyncCount > 0 && (
              <button
                type="button"
                onClick={() => void triggerManualSync()}
                disabled={!isOnline || isSyncing}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-60 cursor-pointer whitespace-nowrap"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="tabular-nums">
                  {isSyncing ? 'Syncing...' : `Sync (${pendingSyncCount})`}
                </span>
              </button>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((v) => !v)}
                className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center tabular-nums">
                    {notifications.length}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900">Notifications</p>
                    <button
                      type="button"
                      onClick={() => setNotifOpen(false)}
                      className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                  <div className="mt-3 max-h-64 overflow-y-auto space-y-2.5">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">No announcements yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                          <p className="text-xs font-bold text-slate-900">{n.title}</p>
                          <p className="mt-0.5 text-xs text-slate-600">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
