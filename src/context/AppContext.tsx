import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  INITIAL_BOOKINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PAYMENTS,
  INITIAL_THREADS,
  INITIAL_USER,
  INITIAL_VERIFICATION_QUEUE,
  MOCK_TUTORS,
} from '../data/mockData';
import { peerLearnService } from '../services/peerLearnService';
import {
  AppRoute,
  AvailabilitySlot,
  Booking,
  MessageThread,
  NotificationItem,
  PaymentRecord,
  SearchFilters,
  ToastItem,
  Tutor,
  UserProfile,
  UserRole,
  VerificationRequest,
} from '../types';

export const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  subject: 'All',
  college: 'All',
  maxPrice: 35,
  minRating: 0,
  mode: 'all',
  availabilityDay: 'All',
  language: 'All',
  yearOfStudy: 'All',
  sortBy: 'relevance',
};

interface BookingPrefill {
  tutorId: string;
  day?: string;
  slot?: string;
  subject?: string;
}

interface AppContextValue {
  route: AppRoute;
  navigate: (route: AppRoute) => void;
  selectedTutorId: string;
  openTutorProfile: (tutorId: string) => void;
  activeSessionId: string;
  openSessionRoom: (bookingId: string) => void;
  activeThreadId: string;
  setActiveThreadId: (id: string) => void;
  openMessageWithTutor: (tutorId: string) => void;
  bookingPrefill: BookingPrefill | null;
  openBookingModal: (prefill: BookingPrefill) => void;
  closeBookingModal: () => void;

  darkMode: boolean;
  toggleDarkMode: () => void;

  isAuthenticated: boolean;
  authInitialMode: 'login' | 'signup';
  authInitialRole: UserRole;
  openAuth: (mode?: 'login' | 'signup', role?: UserRole) => void;
  completeAuth: (profileUpdates: Partial<UserProfile>, isNewTutor?: boolean) => void;
  logout: () => void;

  user: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  switchUserRole: (role: UserRole) => void;

  tutors: Tutor[];
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  resetFilters: () => void;
  applyLandingSearch: (subjectQuery: string, college: string, mode: 'all' | 'online' | 'offline') => void;

  savedTutorIds: string[];
  toggleSavedTutor: (tutorId: string) => void;

  bookings: Booking[];
  createBooking: (booking: Omit<Booking, 'id' | 'status'>) => Booking;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  submitReview: (tutorId: string, bookingId: string | null, rating: number, subject: string, comment: string) => void;

  threads: MessageThread[];
  sendMessage: (threadId: string, text: string, attachmentName?: string) => void;

  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;

  payments: PaymentRecord[];
  verificationQueue: VerificationRequest[];
  handleVerificationDecision: (requestId: string, decision: 'approved' | 'rejected', notes?: string) => void;

  tutorAvailability: AvailabilitySlot[];
  setTutorAvailability: React.Dispatch<React.SetStateAction<AvailabilitySlot[]>>;

  toasts: ToastItem[];
  addToast: (title: string, description?: string, type?: ToastItem['type']) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<AppRoute>('landing');
  const [selectedTutorId, setSelectedTutorId] = useState<string>('t1');
  const [activeSessionId, setActiveSessionId] = useState<string>('b101');
  const [activeThreadId, setActiveThreadId] = useState<string>('m1');
  const [bookingPrefill, setBookingPrefill] = useState<BookingPrefill | null>(null);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('peerlearn_theme') === 'dark';
    }
    return false;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('signup');
  const [authInitialRole, setAuthInitialRole] = useState<UserRole>('learner');

  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [tutors, setTutors] = useState<Tutor[]>(MOCK_TUTORS);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [savedTutorIds, setSavedTutorIds] = useState<string[]>(['t1', 't3']);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [threads, setThreads] = useState<MessageThread[]>(INITIAL_THREADS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [verificationQueue, setVerificationQueue] = useState<VerificationRequest[]>(INITIAL_VERIFICATION_QUEUE);
  const [tutorAvailability, setTutorAvailability] = useState<AvailabilitySlot[]>([
    { day: 'Mon', slots: ['17:00', '18:30', '20:00'] },
    { day: 'Wed', slots: ['18:00', '19:30'] },
    { day: 'Fri', slots: ['16:00', '18:00'] },
    { day: 'Sat', slots: ['11:00', '14:00', '16:00'] },
  ]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('peerlearn_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('peerlearn_theme', 'light');
    }
  }, [darkMode]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (title: string, description?: string, type: ToastItem['type'] = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, title, description, type }]);
      window.setTimeout(() => {
        dismissToast(id);
      }, 4000);
    },
    [dismissToast]
  );

  const navigate = useCallback((nextRoute: AppRoute) => {
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const openTutorProfile = useCallback(
    (tutorId: string) => {
      setSelectedTutorId(tutorId);
      navigate('tutor-profile');
    },
    [navigate]
  );

  const openSessionRoom = useCallback(
    (bookingId: string) => {
      setActiveSessionId(bookingId);
      navigate('session');
    },
    [navigate]
  );

  const openBookingModal = useCallback((prefill: BookingPrefill) => {
    setBookingPrefill(prefill);
  }, []);

  const closeBookingModal = useCallback(() => {
    setBookingPrefill(null);
  }, []);

  const openMessageWithTutor = useCallback(
    (tutorId: string) => {
      const existing = threads.find((th) => th.participantId === tutorId);
      if (existing) {
        setActiveThreadId(existing.id);
        navigate('messages');
        return;
      }

      const tutor = tutors.find((t) => t.id === tutorId);
      if (!tutor) return;

      const newThread: MessageThread = {
        id: `m-${Date.now()}`,
        participantId: tutor.id,
        participantName: tutor.name,
        participantCollege: tutor.college,
        participantAvatar: tutor.avatar,
        participantInitials: tutor.initials,
        participantRole: 'tutor',
        unreadCount: 0,
        messages: [
          {
            id: `msg-init-${Date.now()}`,
            sender: 'them',
            text: `Hi ${user.name.split(' ')[0]}! Feel free to share which topic or problem set you'd like help with.`,
            timestamp: 'Just now',
          },
        ],
      };

      setThreads((prev) => [newThread, ...prev]);
      setActiveThreadId(newThread.id);
      navigate('messages');
    },
    [threads, tutors, user.name, navigate]
  );

  const openAuth = useCallback(
    (mode: 'login' | 'signup' = 'signup', role: UserRole = 'learner') => {
      setAuthInitialMode(mode);
      setAuthInitialRole(role);
      navigate('auth');
    },
    [navigate]
  );

  const completeAuth = useCallback(
    (profileUpdates: Partial<UserProfile>, isNewTutor?: boolean) => {
      const nextName = profileUpdates.name || user.name;
      const initials = nextName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      const updated: UserProfile = {
        ...user,
        ...profileUpdates,
        initials: initials || user.initials,
      };
      setUser(updated);
      setIsAuthenticated(true);

      if (isNewTutor) {
        addToast('Application submitted', 'Your college ID is queued for verification.', 'info');
        navigate('tutor-dashboard');
      } else {
        addToast(`Welcome back, ${updated.name.split(' ')[0]}!`, `Signed in as ${updated.role}.`);
        navigate(updated.role === 'tutor' ? 'tutor-dashboard' : 'learner-dashboard');
      }
    },
    [user, addToast, navigate]
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    addToast('Signed out', 'You can sign back in or switch demo accounts anytime.', 'info');
    navigate('landing');
  }, [addToast, navigate]);

  const updateUserProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      setUser((prev) => ({ ...prev, ...updates }));
      addToast('Preferences saved', 'Your profile updates are active.');
    },
    [addToast]
  );

  const switchUserRole = useCallback(
    (nextRole: UserRole) => {
      setUser((prev) => ({ ...prev, role: nextRole }));
      addToast(
        `Switched to ${nextRole === 'tutor' ? 'Tutor' : 'Learner'} mode`,
        nextRole === 'tutor'
          ? 'Manage incoming requests, rates, and earnings.'
          : 'Browse verified student tutors and upcoming sessions.',
        'info'
      );
      if (route === 'learner-dashboard' || route === 'tutor-dashboard') {
        navigate(nextRole === 'tutor' ? 'tutor-dashboard' : 'learner-dashboard');
      }
    },
    [addToast, navigate, route]
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const applyLandingSearch = useCallback(
    (subjectQuery: string, college: string, mode: 'all' | 'online' | 'offline') => {
      setFilters({
        ...DEFAULT_FILTERS,
        query: subjectQuery,
        college: college || 'All',
        mode,
      });
      navigate('find-tutors');
    },
    [navigate]
  );

  const toggleSavedTutor = useCallback(
    (tutorId: string) => {
      setSavedTutorIds((prev) => {
        const exists = prev.includes(tutorId);
        const next = exists ? prev.filter((id) => id !== tutorId) : [...prev, tutorId];
        addToast(exists ? 'Removed from saved tutors' : 'Tutor saved to shortlist', undefined, 'info');
        return next;
      });
    },
    [addToast]
  );

  const createBooking = useCallback(
    (input: Omit<Booking, 'id' | 'status'>): Booking => {
      const newBooking: Booking = {
        ...input,
        id: `b-${Date.now()}`,
        status: 'upcoming',
      };
      setBookings((prev) => [newBooking, ...prev]);

      const newPayment: PaymentRecord = {
        id: `p-${Date.now()}`,
        date: 'Nov 17, 2026',
        description: `${input.subject} ${input.sessionType} Session with ${input.tutorName}`,
        tutorName: input.tutorName,
        method: 'UPI · Instant Checkout',
        amount: input.totalAmount,
        status: 'Paid',
      };
      setPayments((prev) => [newPayment, ...prev]);

      const newNotif: NotificationItem = {
        id: `n-${Date.now()}`,
        title: `Session confirmed with ${input.tutorName}`,
        description: `${input.subject} · ${input.date} at ${input.timeSlot}`,
        timestamp: 'Just now',
        read: false,
        targetRoute: 'learner-dashboard',
      };
      setNotifications((prev) => [newNotif, ...prev]);

      addToast('Session booked!', `${input.subject} with ${input.tutorName} is confirmed.`);
      return newBooking;
    },
    [addToast]
  );

  const updateBookingStatus = useCallback(
    (bookingId: string, status: Booking['status']) => {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
      const label =
        status === 'upcoming'
          ? 'Request accepted'
          : status === 'declined'
            ? 'Request declined'
            : status === 'completed'
              ? 'Session marked complete'
              : 'Booking updated';
      addToast(label, undefined, status === 'declined' ? 'info' : 'success');
    },
    [addToast]
  );

  const submitReview = useCallback(
    (tutorId: string, bookingId: string | null, rating: number, subject: string, comment: string) => {
      setTutors((prev) =>
        prev.map((tutor) => {
          if (tutor.id !== tutorId) return tutor;
          const newReview = {
            id: `r-${Date.now()}`,
            authorName: user.name,
            authorCollege: user.college,
            rating,
            subject,
            date: 'Nov 2026',
            comment,
          };
          const { nextRating, nextCount } = peerLearnService.computeNewRating(
            tutor.reviews,
            tutor.rating,
            tutor.reviewCount,
            rating
          );
          return {
            ...tutor,
            rating: nextRating,
            reviewCount: nextCount,
            reviews: [newReview, ...tutor.reviews],
          };
        })
      );

      if (bookingId) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, reviewed: true } : b))
        );
      }

      addToast('Review published', 'Thank you for helping other students choose a great tutor.');
    },
    [user.name, user.college, addToast]
  );

  const sendMessage = useCallback((threadId: string, text: string, attachmentName?: string) => {
    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id !== threadId) return thread;
        return {
          ...thread,
          unreadCount: 0,
          messages: [
            ...thread.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'me',
              text,
              timestamp: 'Just now',
              attachmentName,
            },
          ],
        };
      })
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const handleVerificationDecision = useCallback(
    (requestId: string, decision: 'approved' | 'rejected', notes?: string) => {
      setVerificationQueue((prev) =>
        prev.map((item) =>
          item.id === requestId ? { ...item, status: decision, notes } : item
        )
      );
      addToast(
        decision === 'approved' ? 'Tutor verified' : 'Application rejected',
        decision === 'approved'
          ? 'Verified badge granted and profile activated.'
          : 'Applicant notified with review notes.',
        decision === 'approved' ? 'success' : 'info'
      );
    },
    [addToast]
  );

  return (
    <AppContext.Provider
      value={{
        route,
        navigate,
        selectedTutorId,
        openTutorProfile,
        activeSessionId,
        openSessionRoom,
        activeThreadId,
        setActiveThreadId,
        openMessageWithTutor,
        bookingPrefill,
        openBookingModal,
        closeBookingModal,
        darkMode,
        toggleDarkMode,
        isAuthenticated,
        authInitialMode,
        authInitialRole,
        openAuth,
        completeAuth,
        logout,
        user,
        updateUserProfile,
        switchUserRole,
        tutors,
        filters,
        setFilters,
        resetFilters,
        applyLandingSearch,
        savedTutorIds,
        toggleSavedTutor,
        bookings,
        createBooking,
        updateBookingStatus,
        submitReview,
        threads,
        sendMessage,
        notifications,
        markAllNotificationsRead,
        markNotificationRead,
        payments,
        verificationQueue,
        handleVerificationDecision,
        tutorAvailability,
        setTutorAvailability,
        toasts,
        addToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
