import React, { useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Clock,
  Globe,
  MapPin,
  MessageSquare,
  Video,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SessionType } from '../types';
import { Avatar } from '../components/ui/Avatar';
import { AvailabilityPicker } from '../components/ui/AvailabilityPicker';
import { RatingStars } from '../components/ui/RatingStars';
import { ReviewCard } from '../components/ui/ReviewCard';
import { SubjectChip } from '../components/ui/SubjectChip';
import { TutorCard } from '../components/ui/TutorCard';
import { VerifiedBadge } from '../components/ui/VerifiedBadge';

export function TutorProfilePage() {
  const {
    tutors,
    selectedTutorId,
    navigate,
    openTutorProfile,
    openBookingModal,
    openMessageWithTutor,
    savedTutorIds,
    toggleSavedTutor,
  } = useApp();

  const tutor = tutors.find((t) => t.id === selectedTutorId) || tutors[0];
  const isSaved = savedTutorIds.includes(tutor.id);

  const [sessionType, setSessionType] = useState<SessionType>('1-on-1');
  const [pickedDay, setPickedDay] = useState<string>('');
  const [pickedSlot, setPickedSlot] = useState<string>('');

  const similarTutors = tutors
    .filter(
      (other) =>
        other.id !== tutor.id &&
        other.subjects.some((s) => tutor.subjects.includes(s))
    )
    .slice(0, 3);

  const ratingBreakdown = [
    { stars: 5, pct: 88 },
    { stars: 4, pct: 9 },
    { stars: 3, pct: 3 },
    { stars: 2, pct: 0 },
    { stars: 1, pct: 0 },
  ];

  const displayedRate =
    sessionType === '1-on-1' ? tutor.hourlyRate : tutor.groupHourlyRate;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      <button
        type="button"
        onClick={() => navigate('find-tutors')}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5F5D57] dark:text-slate-400 hover:text-[#141413] dark:hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all tutors</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Main Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Profile Header */}
          <section className="bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
              <div className="flex items-start gap-5">
                <Avatar
                  src={tutor.avatar}
                  alt={tutor.name}
                  initials={tutor.initials}
                  tone={tutor.avatarTone}
                  size="xl"
                />
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-2xl font-display font-bold text-[#141413] dark:text-white">
                      {tutor.name}
                    </h1>
                    <VerifiedBadge verified={tutor.verified} />
                  </div>
                  <p className="text-sm text-[#5F5D57] dark:text-slate-300">
                    {tutor.college} · {tutor.course} · {tutor.yearOfStudy}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#5F5D57] dark:text-slate-400">
                    <RatingStars rating={tutor.rating} reviewCount={tutor.reviewCount} />
                    <span className="tabular-nums">{tutor.sessionsCompleted} sessions completed</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {tutor.responseTime}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleSavedTutor(tutor.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-colors shrink-0 ${
                  isSaved
                    ? 'bg-[#5B4BFF]/10 border-[#5B4BFF]/30 text-[#5B4BFF] dark:text-[#9D94FF]'
                    : 'border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            <p className="mt-5 text-base font-medium text-[#141413] dark:text-slate-100">
              {tutor.headline}
            </p>
          </section>

          {/* About & Teaching Style */}
          <section className="bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-display font-semibold text-[#141413] dark:text-white">
                About {tutor.name.split(' ')[0]}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#3E3D38] dark:text-slate-300">
                {tutor.bio}
              </p>
            </div>

            <div className="pt-5 border-t border-[#E6E4DF] dark:border-[#272B38]">
              <h3 className="text-sm font-display font-semibold text-[#141413] dark:text-white">
                Teaching style
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3E3D38] dark:text-slate-300">
                {tutor.teachingStyle}
              </p>
            </div>

            <div className="pt-5 border-t border-[#E6E4DF] dark:border-[#272B38] grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-display font-semibold text-[#141413] dark:text-white mb-2.5">
                  Subjects & expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subj) => (
                    <SubjectChip key={subj} label={subj} size="md" />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-display font-semibold text-[#141413] dark:text-white mb-2.5">
                  Languages & locations
                </h3>
                <p className="text-sm text-[#3E3D38] dark:text-slate-300 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#5B4BFF]" aria-hidden="true" />
                  <span>{tutor.languages.join(', ')}</span>
                </p>
                {tutor.campusMeetupSpot && (
                  <p className="mt-2 text-sm text-[#3E3D38] dark:text-slate-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0" aria-hidden="true" />
                    <span>{tutor.campusMeetupSpot}</span>
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Weekly Availability */}
          <section className="bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-display font-semibold text-[#141413] dark:text-white">
                  Weekly availability
                </h2>
                <p className="text-xs text-[#5F5D57] dark:text-slate-400">
                  Click any time slot to pre-fill your booking request.
                </p>
              </div>
            </div>

            <AvailabilityPicker
              availability={tutor.availability}
              selectedDay={pickedDay}
              selectedSlot={pickedSlot}
              onSelectSlot={(day, slot) => {
                setPickedDay(day);
                setPickedSlot(slot);
                openBookingModal({ tutorId: tutor.id, day, slot });
              }}
            />
          </section>

          {/* Reviews & Rating Breakdown */}
          <section className="space-y-5">
            <div className="bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-display font-semibold text-[#141413] dark:text-white mb-5">
                Student reviews
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-4 text-center sm:text-left">
                  <p className="text-4xl font-display font-bold text-[#141413] dark:text-white tabular-nums">
                    {tutor.rating.toFixed(2)}
                  </p>
                  <div className="mt-1">
                    <RatingStars rating={tutor.rating} />
                  </div>
                  <p className="mt-1 text-xs text-[#5F5D57] dark:text-slate-400 tabular-nums">
                    Based on {tutor.reviewCount} verified sessions
                  </p>
                </div>

                <div className="sm:col-span-8 space-y-2">
                  {ratingBreakdown.map((row) => (
                    <div key={row.stars} className="flex items-center gap-3 text-xs">
                      <span className="w-10 text-[#5F5D57] dark:text-slate-400 tabular-nums">
                        {row.stars} star
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-stone-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <span className="w-9 text-right text-[#5F5D57] dark:text-slate-400 tabular-nums">
                        {row.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {tutor.reviews.length > 0 ? (
              <div className="space-y-4">
                {tutor.reviews.map((rev) => (
                  <ReviewCard key={rev.id} review={rev} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#5F5D57] dark:text-slate-400">
                Completed session reviews from students will appear here.
              </p>
            )}
          </section>
        </div>

        {/* Sticky Right Pricing Card */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl p-6 space-y-5 shadow-sm">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-display font-bold text-[#141413] dark:text-white tabular-nums">
                  ${displayedRate}
                </span>
                <span className="text-sm text-[#5F5D57] dark:text-slate-400"> / hour</span>
              </div>
              <RatingStars rating={tutor.rating} reviewCount={tutor.reviewCount} />
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 dark:bg-[#1E222E] rounded-xl">
              <button
                type="button"
                onClick={() => setSessionType('1-on-1')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                  sessionType === '1-on-1'
                    ? 'bg-white dark:bg-[#171A23] text-[#141413] dark:text-white shadow-xs'
                    : 'text-[#5F5D57] dark:text-slate-400'
                }`}
              >
                1-on-1 (${tutor.hourlyRate})
              </button>
              <button
                type="button"
                onClick={() => setSessionType('group')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                  sessionType === 'group'
                    ? 'bg-white dark:bg-[#171A23] text-[#141413] dark:text-white shadow-xs'
                    : 'text-[#5F5D57] dark:text-slate-400'
                }`}
              >
                Group (${tutor.groupHourlyRate})
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-[#5F5D57] dark:text-slate-300 py-2 border-y border-[#E6E4DF] dark:border-[#272B38]">
              {(tutor.mode === 'online' || tutor.mode === 'both') && (
                <p className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#5B4BFF]" aria-hidden="true" />
                  <span>Online HD video room + shared notes included</span>
                </p>
              )}
              {(tutor.mode === 'offline' || tutor.mode === 'both') && (
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" aria-hidden="true" />
                  <span>In-person meetups at {tutor.college}</span>
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() =>
                  openBookingModal({
                    tutorId: tutor.id,
                    day: pickedDay || undefined,
                    slot: pickedSlot || undefined,
                  })
                }
                className="w-full py-3 px-4 rounded-xl bg-[#5B4BFF] text-white text-sm font-semibold hover:bg-[#4A3AE8] transition-colors"
              >
                Book Session
              </button>
              <button
                type="button"
                onClick={() => openMessageWithTutor(tutor.id)}
                className="w-full py-3 px-4 rounded-xl border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100 text-sm font-semibold hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors inline-flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message {tutor.name.split(' ')[0]}</span>
              </button>
            </div>

            <p className="text-[11px] text-center text-[#5F5D57] dark:text-slate-400">
              Free reschedule or cancellation up to 6 hours before start.
            </p>
          </div>
        </aside>
      </div>

      {/* Similar Tutors */}
      {similarTutors.length > 0 && (
        <section className="space-y-5 pt-6 border-t border-[#E6E4DF] dark:border-[#272B38]">
          <h2 className="text-xl font-display font-bold text-[#141413] dark:text-white">
            Similar peer tutors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {similarTutors.map((sim) => (
              <TutorCard
                key={sim.id}
                tutor={sim}
                saved={savedTutorIds.includes(sim.id)}
                onToggleSave={toggleSavedTutor}
                onViewProfile={openTutorProfile}
                onBookSession={(id) => openBookingModal({ tutorId: id })}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
