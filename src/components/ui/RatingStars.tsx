import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md';
}

export function RatingStars({
  rating,
  reviewCount,
  interactive = false,
  onChange,
  size = 'sm',
}: RatingStarsProps) {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';

  if (interactive && onChange) {
    return (
      <div className="inline-flex items-center gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= rating;
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              aria-label={`Rate ${star} out of 5`}
              className="p-1 rounded-md hover:scale-110 transition-transform focus-visible:outline-2 focus-visible:outline-[#5B4BFF]"
            >
              <Star
                className={`${iconSize} ${
                  active
                    ? 'fill-amber-400 text-amber-500'
                    : 'text-stone-300 dark:text-slate-600'
                }`}
              />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-sm whitespace-nowrap shrink-0 tabular-nums">
      <Star className={`${iconSize} fill-amber-400 text-amber-500 shrink-0`} aria-hidden="true" />
      <span className="font-semibold text-[#141413] dark:text-slate-100">{rating.toFixed(2)}</span>
      {typeof reviewCount === 'number' && (
        <span className="text-[#5F5D57] dark:text-slate-400 text-xs">({reviewCount})</span>
      )}
    </span>
  );
}
