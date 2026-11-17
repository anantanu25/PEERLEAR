import React, { useEffect, useRef, useState } from 'react';
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  RefreshCw,
  Settings,
  ShieldCheck,
  Sun,
  UserCheck,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../ui/Avatar';

export function Navbar() {
  const {
    route,
    navigate,
    darkMode,
    toggleDarkMode,
    isAuthenticated,
    openAuth,
    logout,
    user,
    switchUserRole,
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
    threads,
  } = useApp();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const unreadMessages = threads.reduce((acc, th) => acc + th.unreadCount, 0);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHowItWorks = () => {
    setMobileOpen(false);
    if (route !== 'landing') {
      navigate('landing');
      window.setTimeout(() => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const dashboardRoute = user.role === 'tutor' ? 'tutor-dashboard' : 'learner-dashboard';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F7]/90 dark:bg-[#0F1117]/90 backdrop-blur-md border-b border-[#E6E4DF] dark:border-[#272B38]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          type="button"
          onClick={() => navigate('landing')}
          className="text-xl font-display font-bold tracking-tight text-[#141413] dark:text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#5B4BFF] rounded-md"
        >
          Peer<span className="text-[#5B4BFF]">Learn</span>
        </button>

        {/* Zone 2: Single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#5F5D57] dark:text-slate-300"
        >
          <button
            type="button"
            onClick={() => navigate('find-tutors')}
            className={`whitespace-nowrap shrink-0 hover:text-[#141413] dark:hover:text-white transition-colors ${
              route === 'find-tutors' ? 'text-[#5B4BFF] dark:text-[#9D94FF] font-semibold' : ''
            }`}
          >
            Find Tutors
          </button>
          <button
            type="button"
            onClick={() => openAuth('signup', 'tutor')}
            className="whitespace-nowrap shrink-0 hover:text-[#141413] dark:hover:text-white transition-colors"
          >
            Become a Tutor
          </button>
          <button
            type="button"
            onClick={handleHowItWorks}
            className="whitespace-nowrap shrink-0 hover:text-[#141413] dark:hover:text-white transition-colors"
          >
            How It Works
          </button>
          {isAuthenticated && (
            <>
              <button
                type="button"
                onClick={() => navigate(dashboardRoute)}
                className={`whitespace-nowrap shrink-0 hover:text-[#141413] dark:hover:text-white transition-colors ${
                  route === 'learner-dashboard' || route === 'tutor-dashboard'
                    ? 'text-[#5B4BFF] dark:text-[#9D94FF] font-semibold'
                    : ''
                }`}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => navigate('messages')}
                className={`whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 hover:text-[#141413] dark:hover:text-white transition-colors ${
                  route === 'messages' ? 'text-[#5B4BFF] dark:text-[#9D94FF] font-semibold' : ''
                }`}
              >
                <span>Messages</span>
                {unreadMessages > 0 && (
                  <span className="text-xs font-mono tabular-nums text-[#5B4BFF] dark:text-[#9D94FF]">
                    ({unreadMessages})
                  </span>
                )}
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl text-[#5F5D57] dark:text-slate-300 hover:bg-stone-200/60 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {!isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAuth('login', 'learner')}
                className="px-3.5 py-2 text-sm font-medium text-[#141413] dark:text-slate-200 hover:bg-stone-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors whitespace-nowrap shrink-0"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => openAuth('signup', 'learner')}
                className="px-4 py-2 text-sm font-medium bg-[#5B4BFF] text-white hover:bg-[#4A3AE8] rounded-xl transition-colors whitespace-nowrap shrink-0"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <>
              {/* Notifications Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => {
                    setNotifOpen((prev) => !prev);
                    setProfileOpen(false);
                  }}
                  aria-label="Open notifications"
                  className="relative p-2 rounded-xl text-[#5F5D57] dark:text-slate-300 hover:bg-stone-200/60 dark:hover:bg-slate-800 transition-colors shrink-0"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifs > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-white text-[10px] font-mono font-semibold flex items-center justify-center tabular-nums">
                      {unreadNotifs}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl shadow-xl overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#E6E4DF] dark:border-[#272B38]">
                      <span className="text-sm font-display font-semibold text-[#141413] dark:text-slate-100">
                        Notifications
                      </span>
                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        className="text-xs font-medium text-[#5B4BFF] dark:text-[#9D94FF] hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-[#E6E4DF] dark:divide-[#272B38]">
                      {notifications.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            markNotificationRead(item.id);
                            setNotifOpen(false);
                            navigate(item.targetRoute);
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-stone-50 dark:hover:bg-slate-800/50 transition-colors ${
                            !item.read ? 'bg-[#5B4BFF]/[0.04] dark:bg-[#5B4BFF]/10' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-[#141413] dark:text-slate-100">
                              {item.title}
                            </p>
                            <span className="text-[11px] text-[#5F5D57] dark:text-slate-500 shrink-0">
                              {item.timestamp}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-[#5F5D57] dark:text-slate-400">
                            {item.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen((prev) => !prev);
                    setNotifOpen(false);
                  }}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl border border-[#E6E4DF] dark:border-[#272B38] bg-white dark:bg-[#171A23] hover:border-[#5B4BFF]/40 transition-colors shrink-0"
                  aria-expanded={profileOpen}
                  aria-label="Account menu"
                >
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    initials={user.initials}
                    size="xs"
                  />
                  <span className="hidden sm:inline text-xs font-medium text-[#141413] dark:text-slate-200 whitespace-nowrap">
                    {user.name.split(' ')[0]} ·{' '}
                    <span className="text-[#5B4BFF] dark:text-[#9D94FF]">
                      {user.role === 'tutor' ? 'Tutor' : 'Learner'}
                    </span>
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#5F5D57] dark:text-slate-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-[#E6E4DF] dark:border-[#272B38]">
                      <p className="text-sm font-semibold text-[#141413] dark:text-slate-100 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-[#5F5D57] dark:text-slate-400 truncate">
                        {user.college} · {user.yearOfStudy}
                      </p>
                    </div>

                    <div className="py-1 border-b border-[#E6E4DF] dark:border-[#272B38]">
                      <button
                        type="button"
                        onClick={() => {
                          switchUserRole(user.role === 'learner' ? 'tutor' : 'learner');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-xs font-medium text-[#5B4BFF] dark:text-[#9D94FF] hover:bg-stone-50 dark:hover:bg-slate-800/60"
                      >
                        <RefreshCw className="w-4 h-4 shrink-0" />
                        <span>
                          Switch to {user.role === 'learner' ? 'Tutor' : 'Learner'} Mode
                        </span>
                      </button>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          navigate('learner-dashboard');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-[#141413] dark:text-slate-200 hover:bg-stone-50 dark:hover:bg-slate-800/60"
                      >
                        <UserCheck className="w-4 h-4 text-[#5F5D57] dark:text-slate-400" />
                        <span>Learner Dashboard</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigate('tutor-dashboard');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-[#141413] dark:text-slate-200 hover:bg-stone-50 dark:hover:bg-slate-800/60"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#5F5D57] dark:text-slate-400" />
                        <span>Tutor Dashboard</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigate('settings');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-[#141413] dark:text-slate-200 hover:bg-stone-50 dark:hover:bg-slate-800/60"
                      >
                        <Settings className="w-4 h-4 text-[#5F5D57] dark:text-slate-400" />
                        <span>Settings</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigate('admin');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-[#141413] dark:text-slate-200 hover:bg-stone-50 dark:hover:bg-slate-800/60"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                        <span>Verification Queue</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-[#E6E4DF] dark:border-[#272B38]">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-stone-50 dark:hover:bg-slate-800/60"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 rounded-xl text-[#141413] dark:text-slate-200 hover:bg-stone-200/60 dark:hover:bg-slate-800"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E6E4DF] dark:border-[#272B38] bg-white dark:bg-[#171A23] px-4 py-4 space-y-2">
          <button
            type="button"
            onClick={() => {
              navigate('find-tutors');
              setMobileOpen(false);
            }}
            className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#141413] dark:text-slate-100 hover:bg-stone-100 dark:hover:bg-slate-800"
          >
            Find Tutors
          </button>
          <button
            type="button"
            onClick={() => {
              openAuth('signup', 'tutor');
              setMobileOpen(false);
            }}
            className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#141413] dark:text-slate-100 hover:bg-stone-100 dark:hover:bg-slate-800"
          >
            Become a Tutor
          </button>
          <button
            type="button"
            onClick={handleHowItWorks}
            className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#141413] dark:text-slate-100 hover:bg-stone-100 dark:hover:bg-slate-800"
          >
            How It Works
          </button>
          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => {
                  navigate(dashboardRoute);
                  setMobileOpen(false);
                }}
                className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#141413] dark:text-slate-100 hover:bg-stone-100 dark:hover:bg-slate-800"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('messages');
                  setMobileOpen(false);
                }}
                className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#141413] dark:text-slate-100 hover:bg-stone-100 dark:hover:bg-slate-800"
              >
                Messages {unreadMessages > 0 ? `(${unreadMessages})` : ''}
              </button>
            </>
          ) : (
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  openAuth('login', 'learner');
                  setMobileOpen(false);
                }}
                className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  openAuth('signup', 'learner');
                  setMobileOpen(false);
                }}
                className="flex-1 py-2.5 text-sm font-medium rounded-xl bg-[#5B4BFF] text-white"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
