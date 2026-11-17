import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface VerifiedBadgeProps {
  verified: boolean;
  compact?: boolean;
}

export function VerifiedBadge({ verified, compact = false }: VerifiedBadgeProps) {
  if (!verified) return null;

  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium text-[#5B4BFF] dark:text-[#8C82FF] shrink-0 whitespace-nowrap"
      title="College email & student ID verified"
    >
      <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      {!compact && <span>Verified student</span>}
    </span>
  );
}
