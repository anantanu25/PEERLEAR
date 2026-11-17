import React, { useState } from 'react';
import { Calendar, MapPin, MessageSquare, RotateCcw, Star, Video } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import { Avatar } from '../components/ui/Avatar';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { RatingStars } from '../components/ui/RatingStars';
import { StatCard } from '../components/ui/StatCard';
import { Tabs } from '../components/ui/Tabs';
import { TutorCard } from '../components/ui/TutorCard';

export function LearnerDashboardPage() {
  const {
    user,
    bookings,
    tutors,
    savedTutorIds,
    toggleSavedTutor,
    payments,
    navigate,
    openTutorProfile,
    openBookingModal,
    openMessageWithTutor,
    openSessionRoom,
    submitReview,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'saved' | 'payments'>('upcoming');
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const learnerBookings = bookings.filter((b) => b.learnerName === user.name);
  const upcoming = learnerBookings.filter((b) => b.status === 'upcoming');
  const past = learnerBookings.filter((b) => b.status === 'completed');
  const savedTutors = tutors.filter((t) => savedTutorIds.includes(t.id));

  const hoursLearned = past.reduce((sum, b) => sum + b.durationHours, 0) + 12;
  const uniqueSubjects = new Set(learnerBookings.map((b) => b.subject)).size;

  const handlePublishReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTarget) return;
    submitReview(
      reviewTarget.tutorId,
      reviewTarget.id,
      reviewRating,
      reviewTarget.subject,
      reviewComment.trim() || 'Clear explanations and super helpful walkthrough!'
    );
    setReviewTarget(null);
    setReviewComment('');
    setReviewRating(5);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#141413] dark:text-white">
            Learner Dashboard
          </h1>
          <p className="mt-1 text-sm text-[#5F5D57] dark:text-slate-400">
            {user.name} · {user.college} · {user.course}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('messages')}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-[#E6E4DF] dark:border-[#272B38] bg-white dark:bg-[#171A23] text-[#141413] dark:text-slate-100 hover:bg-stone-50 dark:hover:bg-slate-800 inline-flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Messages</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('find-tutors')}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-[#5B4BFF] text-white hover:bg-[#4A3AE8]"
          >
            Find a Tutor
          </button>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Hours learned"
          value={`${hoursLearned} hrs`}
          subtext="Across live & campus sessions"
          accent="indigo"
        />
        <StatCard
          label="Subjects covered"
          value={uniqueSubjects}
          subtext="Active semester courses"
        />
        <StatCard
          label="Upcoming sessions"
          value={upcoming.length}
          subtext="Confirmed on schedule"
          accent="amber"
        />
        <StatCard
          label="Saved tutors"
          value={savedTutors.length}
          subtext="Shortlisted for finals"
        />
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <Tabs
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as typeof activeTab)}
          tabs={[
            { id: 'upcoming', label: 'Upcoming Sessions', count: upcoming.length },
            { id: 'past', label: 'Past Sessions', count: past.length },
            { id: 'saved', label: 'Saved Tutors', count: savedTutors.length },
            { id: 'payments', label: 'Payment History', count: payments.length },
          ]}
        />

        {/* Upcoming Sessions */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcoming.length === 0 ? (
              <EmptyState
                title="No upcoming sessions scheduled"
                description="Browse verified student tutors and pick a slot that works for your study week."
                actionLabel="Browse Tutors"
                onAction={() => navigate('find-tutors')}
              />
            ) : (
              upcoming.map((session) => (
                <div
                  key={session.id}
                  className="p-5 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <Avatar
                      src={session.tutorAvatar}
                      alt={session.tutorName}
                      initials={session.tutorInitials}
                      size="md"
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-display font-semibold text-[#141413] dark:text-white">
                          {session.subject}: {session.topic}
                        </h3>
                      </div>
                      <p className="text-xs text-[#5F5D57] dark:text-slate-400">
                        with {session.tutorName} ({session.tutorCollege}) · {session.sessionType}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#3E3D38] dark:text-slate-300 pt-1">
                        <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
                          <Calendar className="w-3.5 h-3.5 text-[#5B4BFF]" />
                          {session.date} at {session.timeSlot}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          {session.mode === 'online' ? (
                            <>
                              <Video className="w-3.5 h-3.5 text-[#5B4BFF]" />
                              <span>Online Video Room</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="w-3.5 h-3.5 text-amber-500" />
                              <span>{session.meetupLocation}</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => openMessageWithTutor(session.tutorId)}
                      className="px-3.5 py-2 text-xs font-medium rounded-xl border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-200 hover:bg-stone-50 dark:hover:bg-slate-800"
                    >
                      Message
                    </button>
                    <button
                      type="button"
                      onClick={() => openSessionRoom(session.id)}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#5B4BFF] text-white hover:bg-[#4A3AE8]"
                    >
                      {session.mode === 'online' ? 'Join Video Room' : 'View Meetup Details'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Past Sessions */}
        {activeTab === 'past' && (
          <div className="space-y-4">
            {past.length === 0 ? (
              <EmptyState
                title="No completed sessions yet"
                description="Your past study sessions, notes, and quick rebook shortcuts will appear here."
              />
            ) : (
              past.map((session) => (
                <div
                  key={session.id}
                  className="p-5 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <Avatar
                      src={session.tutorAvatar}
                      alt={session.tutorName}
                      initials={session.tutorInitials}
                      size="md"
                    />
                    <div>
                      <h3 className="text-base font-display font-semibold text-[#141413] dark:text-white">
                        {session.subject}: {session.topic}
                      </h3>
                      <p className="text-xs text-[#5F5D57] dark:text-slate-400 mt-0.5">
                        {session.tutorName} · {session.date} at {session.timeSlot} ·{' '}
                        <span className="font-mono tabular-nums">${session.totalAmount}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        openBookingModal({
                          tutorId: session.tutorId,
                          subject: session.subject,
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100 hover:bg-stone-50 dark:hover:bg-slate-800"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Rebook</span>
                    </button>

                    {!session.reviewed ? (
                      <button
                        type="button"
                        onClick={() => setReviewTarget(session)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Leave Review</span>
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 px-2">
                        Reviewed
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Saved Tutors */}
        {activeTab === 'saved' && (
          <div>
            {savedTutors.length === 0 ? (
              <EmptyState
                title="No saved tutors yet"
                description="Bookmark tutors while browsing so you can quickly compare schedules before exam week."
                actionLabel="Explore Tutors"
                onAction={() => navigate('find-tutors')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedTutors.map((tutor) => (
                  <TutorCard
                    key={tutor.id}
                    tutor={tutor}
                    saved
                    onToggleSave={toggleSavedTutor}
                    onViewProfile={openTutorProfile}
                    onBookSession={(id) => openBookingModal({ tutorId: id })}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Payment History */}
        {activeTab === 'payments' && (
          <div className="bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E6E4DF] dark:border-[#272B38] text-xs text-[#5F5D57] dark:text-slate-400">
                  <th className="py-3.5 px-5 font-medium">Date</th>
                  <th className="py-3.5 px-5 font-medium">Session</th>
                  <th className="py-3.5 px-5 font-medium">Method</th>
                  <th className="py-3.5 px-5 font-medium text-right">Amount</th>
                  <th className="py-3.5 px-5 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E4DF] dark:divide-[#272B38] text-sm">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-5 text-xs text-[#5F5D57] dark:text-slate-400 whitespace-nowrap tabular-nums">
                      {p.date}
                    </td>
                    <td className="py-3.5 px-5 font-medium text-[#141413] dark:text-slate-100">
                      {p.description}
                    </td>
                    <td className="py-3.5 px-5 text-xs font-mono text-[#5F5D57] dark:text-slate-400 whitespace-nowrap">
                      {p.method}
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono font-semibold text-[#141413] dark:text-slate-100 tabular-nums">
                      ${p.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-5 text-right text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {p.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Leave Review Modal */}
      <Modal
        open={Boolean(reviewTarget)}
        onClose={() => setReviewTarget(null)}
        title={`Review ${reviewTarget?.tutorName || ''}`}
        subtitle={reviewTarget ? `${reviewTarget.subject} · ${reviewTarget.date}` : undefined}
        maxWidth="sm"
      >
        <form onSubmit={handlePublishReview} className="space-y-4">
          <div>
            <span className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-2">
              How helpful was the session?
            </span>
            <RatingStars
              rating={reviewRating}
              interactive
              onChange={setReviewRating}
              size="md"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-1.5">
              Share your experience
            </label>
            <textarea
              rows={4}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="What clicked for you during the session?"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setReviewTarget(null)}
              className="px-4 py-2 text-sm rounded-xl border border-[#E6E4DF] dark:border-[#272B38]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-[#5B4BFF] text-white"
            >
              Publish Review
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
