import React, { useState } from 'react';
import { AvailabilitySlot } from '../../types';

interface AvailabilityPickerProps {
  availability: AvailabilitySlot[];
  selectedDay?: string;
  selectedSlot?: string;
  onSelectSlot: (day: string, slot: string) => void;
  editable?: boolean;
  onToggleEditableSlot?: (day: AvailabilitySlot['day'], slot: string) => void;
}

const ALL_DAYS: AvailabilitySlot['day'][] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEFAULT_TIME_OPTIONS = ['10:00', '14:00', '16:30', '18:00', '19:30', '21:00'];

export function AvailabilityPicker({
  availability,
  selectedDay,
  selectedSlot,
  onSelectSlot,
  editable = false,
  onToggleEditableSlot,
}: AvailabilityPickerProps) {
  const initialDay =
    selectedDay ||
    availability.find((a) => a.slots.length > 0)?.day ||
    'Mon';

  const [activeDay, setActiveDay] = useState<AvailabilitySlot['day']>(
    initialDay as AvailabilitySlot['day']
  );

  const dayEntry = availability.find((a) => a.day === activeDay);
  const slotsForDay = dayEntry?.slots || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-1.5">
        {ALL_DAYS.map((day) => {
          const entry = availability.find((a) => a.day === day);
          const count = entry?.slots.length || 0;
          const isSelected = activeDay === day;
          const disabled = !editable && count === 0;

          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => setActiveDay(day)}
              className={`py-2 px-1 rounded-xl text-center transition-colors border ${
                isSelected
                  ? 'bg-[#5B4BFF] text-white border-[#5B4BFF]'
                  : disabled
                    ? 'bg-stone-50 dark:bg-[#141720] text-stone-300 dark:text-slate-600 border-transparent cursor-not-allowed'
                    : 'bg-white dark:bg-[#171A23] text-[#141413] dark:text-slate-200 border-[#E6E4DF] dark:border-[#272B38] hover:border-[#5B4BFF]/50'
              }`}
            >
              <span className="block text-xs font-medium">{day}</span>
              <span
                className={`block text-[11px] tabular-nums mt-0.5 ${
                  isSelected
                    ? 'text-white/80'
                    : 'text-[#5F5D57] dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {editable && onToggleEditableSlot ? (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {DEFAULT_TIME_OPTIONS.map((slot) => {
            const isActive = slotsForDay.includes(slot);
            return (
              <button
                key={slot}
                type="button"
                onClick={() => onToggleEditableSlot(activeDay, slot)}
                className={`py-2 px-3 rounded-xl text-xs font-mono tabular-nums font-medium border transition-colors ${
                  isActive
                    ? 'bg-[#5B4BFF] text-white border-[#5B4BFF]'
                    : 'bg-white dark:bg-[#171A23] text-[#5F5D57] dark:text-slate-300 border-[#E6E4DF] dark:border-[#272B38] hover:border-[#5B4BFF]/50'
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      ) : slotsForDay.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slotsForDay.map((slot) => {
            const isPicked = selectedDay === activeDay && selectedSlot === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => onSelectSlot(activeDay, slot)}
                className={`py-2 px-3 rounded-xl text-xs font-mono tabular-nums font-medium border transition-colors ${
                  isPicked
                    ? 'bg-[#5B4BFF] text-white border-[#5B4BFF]'
                    : 'bg-stone-50 dark:bg-[#1E222E] text-[#141413] dark:text-slate-200 border-[#E6E4DF] dark:border-[#272B38] hover:border-[#5B4BFF]'
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-[#5F5D57] dark:text-slate-400 py-2">
          No open slots on {activeDay}. Pick another highlighted day.
        </p>
      )}
    </div>
  );
}
