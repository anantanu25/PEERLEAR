import React, { useState } from 'react';
import {
  Check,
  DollarSign,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AvailabilitySlot } from '../types';
import { AvailabilityPicker } from '../components/ui/AvailabilityPicker';
import { ReviewCard } from '../components/ui/ReviewCard';
import { StatCard } from '../components/ui/StatCard';

const WEEKLY_EARNINGS = [
  { label: 'Mon', amount: 28 },
  { label: 'Tue', amount: 42 },
  { label: 'Wed', amount: 14 },
  { label: 'Thu', amount: 56 },
  { label: 'Fri', amount: 35 },
  { label: 'Sat', amount: 70 },
  { label: 'Sun', amount: 48 },
];

const MONTHLY_EARNINGS = [
  { label: 'Aug', amount: 210 },
  { label: 'Sep', amount: 340 },
  { label: 'Oct', amount: 485 },
  { label: 'Nov', amount: 293 },
];

export function TutorDashboardPage() {
  const {
    user,
    updateUserProfile,
    bookings,
    updateBookingStatus,
    tutorAvailability,
    setTutorAvailability,
    tutors,
    navigate,
    addToast,
  } = useApp();

  const [chartPeriod, setChartPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [rateDraft, setRateDraft] = useState(user.hourlyRate);
  const [bioDraft, setBioDraft] = useState(user.bio);

  const incomingRequests = bookings.filter(
    (b) => b.tutorId === user.id && b.status === 'pending'
  );
  const confirmedTutorSessions = bookings.filter(
    (b) => b.tutorId === user.id && b.status === 'upcoming'
  );

  const earningsSeries = chartPeriod === 'weekly' ? WEEKLY_EARNINGS : MONTHLY_EARNINGS;
  const maxBar = Math.max(...earningsSeries.map((e) => e.amount), 1);
  const totalDisplayedEarnings = earningsSeries.reduce((s, e) => s + e.amount, 0);

  const completionSteps = [
    Boolean(user.name),
    Boolean(user.bio && user.bio.length > 20),
    user.subjectsTaught.length > 0,
    tutorAvailability.some((d) => d.slots.length > 0),
    user.tutorVerified,
  ];
  const completionPct = Math.round(
    (completionSteps.filter(Boolean).length / completionSteps.length) * 100
  );

  const handleToggleAvailabilitySlot = (day: AvailabilitySlot['day'], slot: string) => {
    setTutorAvailability((prev) => {
      const existing = prev.find((d) => d.day === day);
      if (!existing) {
        return [...prev, { day, slots: [slot] }];
      }
      const hasSlot = existing.slots.includes(slot);
      const nextSlots = hasSlot
        ? existing.slots.filter((s) => s !== slot)
        : [...existing.slots, slot].sort();
      return prev.map((d) => (d.day === day ? { ...d, slots: nextSlots } : d));
    });
    addToast('Availability updated', `${day} ${slot} toggled.`, 'info');
  };

  const sampleReviews = tutors[0].reviews.slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Verification Banner */}
      {user.tutorVerified ? (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#141413] dark:text-white">
                Verified Student Tutor Active
              </p>
              <p className="text-xs text-[#5F5D57] dark:text-slate-300">
                Your {user.college} ID & email are verified. Learners can book you immediately.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('admin')}
            className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
          >
            View Verification Queue →
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#141413] dark:text-white">
                ID Verification Pending Review
              </p>
              <p className="text-xs text-[#5F5D57] dark:text-slate-300">
                Your college ID is in the queue. Complete profile details while waiting.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('admin')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-semibold"
          >
            Open Admin Queue
          </button>
        </div>
      )}

      {/* Header & Profile Completion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#141413] dark:text-white">
            Tutor Dashboard
          </h1>
          <p className="mt-1 text-sm text-[#5F5D57] dark:text-slate-400">
            Manage session requests, weekly slots, hourly rates, and payouts.
          </p>
        </div>
        <div className="lg:col-span-5 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs font-medium mb-2">
            <span className="text-[#141413] dark:text-slate-100">Profile completion</span>
            <span className="font-mono tabular-nums text-[#5B4BFF] dark:text-[#9D94FF]">
              {completionPct}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-stone-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#5B4BFF] transition-all duration-300"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={chartPeriod === 'weekly' ? 'This week earnings' : 'Semester earnings'}
          value={`$${totalDisplayedEarnings}`}
          subtext="Available for instant UPI payout"
          accent="indigo"
        />
        <StatCard
          label="Pending requests"
          value={incomingRequests.length}
          subtext="Respond within 2 hrs"
          accent="amber"
        />
        <StatCard
          label="Confirmed upcoming"
          value={confirmedTutorSessions.length}
          subtext="Next 7 days"
        />
        <StatCard
          label="Average rating"
          value="4.92"
          subtext="From 24 peer reviews"
          accent="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 cols: Earnings Chart + Session Requests + Reviews */}
        <div className="lg:col-span-7 space-y-8">
          {/* Earnings Chart */}
          <section className="bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-lg font-display font-semibold text-[#141413] dark:text-white">
                  Earnings overview
                </h2>
                <p className="text-xs text-[#5F5D57] dark:text-slate-400">
                  Net tutor payouts after 0% student tutor commission promo
                </p>
              </div>
              <div className="inline-flex p-1 bg-stone-100 dark:bg-[#1E222E] rounded-xl">
                <button
                  type="button"
                  onClick={() => setChartPeriod('weekly')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                    chartPeriod === 'weekly'
                      ? 'bg-white dark:bg-[#171A23] text-[#141413] dark:text-white shadow-xs'
                      : 'text-[#5F5D57] dark:text-slate-400'
                  }`}
                >
                  Weekly
                </button>
                <button
                  type="button"
                  onClick={() => setChartPeriod('monthly')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                    chartPeriod === 'monthly'
                      ? 'bg-white dark:bg-[#171A23] text-[#141413] dark:text-white shadow-xs'
                      : 'text-[#5F5D57] dark:text-slate-400'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            <div className="h-48 flex items-end justify-between gap-3 pt-4">
              {earningsSeries.map((bar) => {
                const heightPct = Math.round((bar.amount / maxBar) * 100);
                return (
                  <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-xs font-mono tabular-nums text-[#5F5D57] dark:text-slate-400">
                      ${bar.amount}
                    </span>
                    <div className="w-full max-w-[44px] h-32 flex items-end">
                      <div
                        className="w-full rounded-t-xl bg-[#5B4BFF] hover:bg-[#4A3AE8] transition-all duration-300"
                        style={{ height: `${Math.max(12, heightPct)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-[#141413] dark:text-slate-300">
                      {bar.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-[#E6E4DF] dark:border-[#272B38] flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-[#5F5D57] dark:text-slate-400">
                Payout destination: <span className="font-mono text-[#141413] dark:text-slate-200">{user.payoutUpi}</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  addToast('Payout initiated', `$${totalDisplayedEarnings} scheduled to ${user.payoutUpi}.`)
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Withdraw Balance</span>
              </button>
            </div>
          </section>

          {/* Incoming Session Requests */}
          <section className="space-y-4">
            <h2 className="text-lg font-display font-semibold text-[#141413] dark:text-white">
              Session requests
            </h2>
            {incomingRequests.length === 0 ? (
              <div className="p-6 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl text-sm text-[#5F5D57] dark:text-slate-400">
                All caught up! New student booking requests will appear here.
              </div>
            ) : (
              incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-display font-semibold text-[#141413] dark:text-white">
                        {req.learnerName} · <span className="text-[#5B4BFF] dark:text-[#9D94FF]">{req.subject}</span>
                      </p>
                      <p className="text-xs text-[#5F5D57] dark:text-slate-400">
                        {req.learnerCollege} · {req.date} at {req.timeSlot} · {req.mode} ·{' '}
                        <span className="font-mono tabular-nums">${req.totalAmount}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateBookingStatus(req.id, 'declined')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl border border-[#E6E4DF] dark:border-[#272B38] text-[#5F5D57] dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateBookingStatus(req.id, 'upcoming')}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-[#5B4BFF] text-white hover:bg-[#4A3AE8]"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-[#3E3D38] dark:text-slate-300 bg-stone-50 dark:bg-[#1E222E] rounded-xl p-3">
                    “{req.note}”
                  </p>
                </div>
              ))
            )}
          </section>

          {/* Recent Reviews Received */}
          <section className="space-y-4">
            <h2 className="text-lg font-display font-semibold text-[#141413] dark:text-white">
              Recent reviews received
            </h2>
            <div className="space-y-3">
              {sampleReviews.map((rev) => (
                <ReviewCard key={rev.id} review={rev} />
              ))}
            </div>
          </section>
        </div>

        {/* Right 5 cols: Calendar Availability & Rate Editor */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="text-lg font-display font-semibold text-[#141413] dark:text-white">
                Manage weekly availability
              </h2>
              <p className="text-xs text-[#5F5D57] dark:text-slate-400">
                Click time slots below to open or close booking hours.
              </p>
            </div>
            <AvailabilityPicker
              availability={tutorAvailability}
              onSelectSlot={() => {}}
              editable
              onToggleEditableSlot={handleToggleAvailabilitySlot}
            />
          </section>

          <section className="bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-display font-semibold text-[#141413] dark:text-white">
              Rates & teaching profile
            </h2>
            <div>
              <label className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-1.5">
                Hourly rate ($/hr)
              </label>
              <input
                type="number"
                min={5}
                max={75}
                value={rateDraft}
                onChange={(e) => setRateDraft(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-1.5">
                Bio shown to students
              </label>
              <textarea
                rows={3}
                value={bioDraft}
                onChange={(e) => setBioDraft(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
              />
            </div>
            <button
              type="button"
              onClick={() => updateUserProfile({ hourlyRate: rateDraft, bio: bioDraft })}
              className="w-full py-2.5 rounded-xl bg-[#5B4BFF] text-white text-sm font-semibold hover:bg-[#4A3AE8]"
            >
              Save Tutor Settings
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
