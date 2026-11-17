import React from 'react';
import { Bookmark, MapPin, Video } from 'lucide-react';
import { Tutor } from '../../types';
import { Avatar } from './Avatar';
import { RatingStars } from './RatingStars';
import { SubjectChip } from './SubjectChip';
import { VerifiedBadge } from './VerifiedBadge';

interface TutorCardProps {
  tutor: Tutor;
  layout?: 'grid' | 'list';
  saved?: boolean;
  onToggleSave?: (id: string) => void;
  onViewProfile: (id: string) => void;
  onBookSession: (id: string) => void;
  onSubjectClick?: (subject: string) => void;
}

export function TutorCard({
  tutor,
  layout = 'grid',
  saved = false,
  onToggleSave,
  onViewProfile,
  onBookSession,
  onSubjectClick,
}: TutorCardProps) {
  const isList = layout === 'list';

  return (
    <article
      className={`group bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl p-5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md flex ${
        isList ? 'flex-col md:flex-row md:items-center gap-6' : 'flex-col justify-between gap-4'
      }`}
    >
      <div className={`flex-1 min-w-0 ${isList ? 'flex flex-col sm:flex-row gap-5 items-start' : 'space-y-4'}`}>
        <div className="flex items-start justify-between gap-3 w-full">
          <div className="flex items-center gap-3.5 min-w-0">
            <button
              type="button"
              onClick={() => onViewProfile(tutor.id)}
              className="rounded-full focus-visible:outline-2 focus-visible:outline-[#5B4BFF]"
            >
              <Avatar
                src={tutor.avatar}
                alt={tutor.name}
                initials={tutor.initials}
                tone={tutor.avatarTone}
                size="lg"
              />
            </button>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onViewProfile(tutor.id)}
                  className="text-base font-display font-semibold text-[#141413] dark:text-slate-100 hover:text-[#5B4BFF] dark:hover:text-[#9D94FF] transition-colors truncate"
                >
                  {tutor.name}
                </button>
                <VerifiedBadge verified={tutor.verified} compact />
              </div>
              <p className="text-xs text-[#5F5D57] dark:text-slate-400 truncate mt-0.5">
                {tutor.college} <span aria-hidden="true">·</span> {tutor.yearOfStudy}
              </p>
              <p className="text-xs text-[#5F5D57] dark:text-slate-400 truncate">
                {tutor.course}
              </p>
            </div>
          </div>

          {onToggleSave && (
            <button
              type="button"
              onClick={() => onToggleSave(tutor.id)}
              aria-label={saved ? `Remove ${tutor.name} from saved tutors` : `Save ${tutor.name}`}
              className={`p-2 rounded-xl border transition-colors shrink-0 ${
                saved
                  ? 'bg-[#5B4BFF]/10 border-[#5B4BFF]/30 text-[#5B4BFF] dark:text-[#9D94FF]'
                  : 'border-transparent text-[#5F5D57] dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        <div className={isList ? 'flex-1 min-w-0 space-y-3' : 'space-y-3'}>
          <p className="text-sm text-[#3E3D38] dark:text-slate-300 line-clamp-2 leading-relaxed">
            {tutor.headline}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {tutor.subjects.slice(0, 4).map((subject) => (
              <SubjectChip
                key={subject}
                label={subject}
                onClick={onSubjectClick ? () => onSubjectClick(subject) : undefined}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#5F5D57] dark:text-slate-400 pt-1">
            <RatingStars rating={tutor.rating} reviewCount={tutor.reviewCount} />
            <span className="tabular-nums">{tutor.sessionsCompleted} sessions</span>
            <span className="inline-flex items-center gap-2">
              {(tutor.mode === 'online' || tutor.mode === 'both') && (
                <span className="inline-flex items-center gap-1" title="Online video sessions">
                  <Video className="w-3.5 h-3.5 text-[#5B4BFF] dark:text-[#9D94FF]" aria-hidden="true" />
                  <span>Online</span>
                </span>
              )}
              {(tutor.mode === 'offline' || tutor.mode === 'both') && (
                <span className="inline-flex items-center gap-1" title="In-person campus sessions">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                  <span>Campus</span>
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div
        className={`flex items-center justify-between gap-3 pt-4 border-t border-[#E6E4DF] dark:border-[#272B38] ${
          isList ? 'md:flex-col md:items-end md:border-t-0 md:border-l md:pl-6 md:pt-0 md:w-48 shrink-0' : ''
        }`}
      >
        <div className={isList ? 'md:text-right' : ''}>
          <span className="text-lg font-display font-bold text-[#141413] dark:text-slate-100 tabular-nums">
            ${tutor.hourlyRate}
          </span>
          <span className="text-xs text-[#5F5D57] dark:text-slate-400"> / hr</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewProfile(tutor.id)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            View Profile
          </button>
          <button
            type="button"
            onClick={() => onBookSession(tutor.id)}
            className="px-3.5 py-2 text-xs font-medium rounded-xl bg-[#5B4BFF] text-white hover:bg-[#4A3AE8] transition-colors whitespace-nowrap shrink-0"
          >
            Book Session
          </button>
        </div>
      </div>
    </article>
  );
}
