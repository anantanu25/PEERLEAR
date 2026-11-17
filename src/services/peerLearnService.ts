import {
  Booking,
  Review,
  SearchFilters,
  Tutor,
} from '../types';

/**
 * Service abstraction layer for PeerLearn.
 * Currently backed by local state; structured for direct drop-in replacement
 * with Supabase (`@supabase/supabase-js`) queries and RPC calls.
 */
export const peerLearnService = {
  filterAndSortTutors(tutors: Tutor[], filters: SearchFilters): Tutor[] {
    const q = filters.query.trim().toLowerCase();

    const filtered = tutors.filter((tutor) => {
      if (q) {
        const matchesQuery =
          tutor.name.toLowerCase().includes(q) ||
          tutor.college.toLowerCase().includes(q) ||
          tutor.headline.toLowerCase().includes(q) ||
          tutor.course.toLowerCase().includes(q) ||
          tutor.subjects.some((s) => s.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      if (filters.subject && filters.subject !== 'All') {
        if (!tutor.subjects.some((s) => s.toLowerCase() === filters.subject.toLowerCase())) {
          return false;
        }
      }

      if (filters.college && filters.college !== 'All') {
        if (tutor.college !== filters.college) return false;
      }

      if (tutor.hourlyRate > filters.maxPrice) return false;
      if (tutor.rating < filters.minRating) return false;

      if (filters.mode !== 'all') {
        if (tutor.mode !== 'both' && tutor.mode !== filters.mode) return false;
      }

      if (filters.availabilityDay && filters.availabilityDay !== 'All') {
        const hasDay = tutor.availability.some(
          (slot) => slot.day === filters.availabilityDay && slot.slots.length > 0
        );
        if (!hasDay) return false;
      }

      if (filters.language && filters.language !== 'All') {
        if (!tutor.languages.includes(filters.language)) return false;
      }

      if (filters.yearOfStudy && filters.yearOfStudy !== 'All') {
        if (tutor.yearOfStudy !== filters.yearOfStudy) return false;
      }

      return true;
    });

    const sorted = [...filtered];
    switch (filters.sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'sessions':
        sorted.sort((a, b) => b.sessionsCompleted - a.sessionsCompleted);
        break;
      case 'relevance':
      default:
        sorted.sort((a, b) => {
          const scoreA = (a.verified ? 10 : 0) + a.rating * 2 + (a.featured ? 3 : 0);
          const scoreB = (b.verified ? 10 : 0) + b.rating * 2 + (b.featured ? 3 : 0);
          return scoreB - scoreA;
        });
        break;
    }

    return sorted;
  },

  buildCalendarIcs(booking: Booking): string {
    const uid = `peerlearn-${booking.id}@peerlearn.app`;
    const location =
      booking.mode === 'online'
        ? booking.meetingLink || 'https://peerlearn.meet/room'
        : booking.meetupLocation || 'Campus Study Spot';
    const summary = `PeerLearn: ${booking.subject} with ${booking.tutorName}`;
    const description = `Topic: ${booking.topic}\\nMode: ${booking.mode}\\nNotes: ${booking.note}`;

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//PeerLearn//Session Booking//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      'DTSTART:20261118T183000Z',
      'DTEND:20261118T193000Z',
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
  },

  computeNewRating(existingReviews: Review[], currentRating: number, currentCount: number, newScore: number) {
    const totalPoints = currentRating * currentCount + newScore;
    const nextCount = currentCount + 1;
    const nextRating = Number((totalPoints / nextCount).toFixed(2));
    return { nextRating, nextCount };
  },
};
