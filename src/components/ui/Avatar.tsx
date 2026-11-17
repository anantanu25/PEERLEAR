import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  initials: string;
  tone?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-9 h-9 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
};

export function Avatar({
  src,
  alt,
  initials,
  tone = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200',
  size = 'md',
  className = '',
}: AvatarProps) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`${SIZE_CLASSES[size]} rounded-full object-cover shrink-0 border border-black/10 dark:border-white/10 ${className}`}
      />
    );
  }

  return (
    <div
      aria-label={alt}
      className={`${SIZE_CLASSES[size]} ${tone} rounded-full flex items-center justify-center font-display font-semibold shrink-0 border border-black/5 dark:border-white/10 ${className}`}
    >
      {initials}
    </div>
  );
}
