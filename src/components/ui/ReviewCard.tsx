import React from 'react';
import { Review } from '../../types';
import { RatingStars } from './RatingStars';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="p-5 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-[#141413] dark:text-slate-100">
            {review.authorName}
          </p>
          <p className="text-xs text-[#5F5D57] dark:text-slate-400">
            {review.authorCollege} <span aria-hidden="true">·</span> {review.subject}{' '}
            <span aria-hidden="true">·</span> {review.date}
          </p>
        </div>
        <RatingStars rating={review.rating} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[#3E3D38] dark:text-slate-300">
        {review.comment}
      </p>
    </article>
  );
}
