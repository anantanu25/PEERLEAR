export type UserRole = 'learner' | 'tutor';
export type SessionMode = 'online' | 'offline' | 'both';
export type SessionType = '1-on-1' | 'group';

export type AppRoute =
  | 'landing'
  | 'find-tutors'
  | 'tutor-profile'
  | 'auth'
  | 'learner-dashboard'
  | 'tutor-dashboard'
  | 'messages'
  | 'session'
  | 'settings'
  | 'admin'
  | '404';

export interface Review {
  id: string;
  authorName: string;
  authorCollege: string;
  rating: number;
  subject: string;
  date: string;
  comment: string;
}

export interface AvailabilitySlot {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  slots: string[];
}

export interface Tutor {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  avatarTone: string;
  college: string;
  course: string;
  yearOfStudy: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Masters' | 'PhD';
  verified: boolean;
  subjects: string[];
  headline: string;
  bio: string;
  teachingStyle: string;
  languages: string[];
  hourlyRate: number;
  groupHourlyRate: number;
  rating: number;
  reviewCount: number;
  sessionsCompleted: number;
  mode: SessionMode;
  campusMeetupSpot?: string;
  responseTime: string;
  availability: AvailabilitySlot[];
  reviews: Review[];
  featured?: boolean;
}

export type BookingStatus = 'pending' | 'upcoming' | 'completed' | 'declined' | 'cancelled';

export interface Booking {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorCollege: string;
  tutorAvatar?: string;
  tutorInitials: string;
  learnerName: string;
  learnerCollege: string;
  subject: string;
  topic: string;
  sessionType: SessionType;
  mode: 'online' | 'offline';
  date: string;
  timeSlot: string;
  durationHours: number;
  totalAmount: number;
  status: BookingStatus;
  note: string;
  meetingLink?: string;
  meetupLocation?: string;
  reviewed?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
  attachmentName?: string;
}

export interface MessageThread {
  id: string;
  participantId: string;
  participantName: string;
  participantCollege: string;
  participantAvatar?: string;
  participantInitials: string;
  participantRole: UserRole;
  unreadCount: number;
  sessionContext?: {
    bookingId: string;
    subject: string;
    date: string;
    timeSlot: string;
    mode: 'online' | 'offline';
    status: BookingStatus;
  };
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  targetRoute: AppRoute;
}

export interface PaymentRecord {
  id: string;
  date: string;
  description: string;
  tutorName: string;
  method: string;
  amount: number;
  status: 'Paid' | 'Refunded' | 'Pending';
}

export interface VerificationRequest {
  id: string;
  name: string;
  email: string;
  college: string;
  course: string;
  yearOfStudy: string;
  subjects: string[];
  submittedAt: string;
  idImageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  course: string;
  yearOfStudy: string;
  role: UserRole;
  avatar?: string;
  initials: string;
  bio: string;
  subjectsTaught: string[];
  hourlyRate: number;
  tutorVerified: boolean;
  payoutUpi: string;
  languages: string[];
  notificationPrefs: {
    sessionReminders: boolean;
    newMessages: boolean;
    marketingTips: boolean;
  };
  privacyPrefs: {
    showCollegePublicly: boolean;
    allowCrossCollegeRequests: boolean;
  };
}

export interface SearchFilters {
  query: string;
  subject: string;
  college: string;
  maxPrice: number;
  minRating: number;
  mode: 'all' | 'online' | 'offline';
  availabilityDay: string;
  language: string;
  yearOfStudy: string;
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'sessions';
}

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
