import React, { useEffect, useState } from 'react';
import { CalendarPlus, CheckCircle2, CreditCard, MapPin, Smartphone, Video } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { peerLearnService } from '../../services/peerLearnService';
import { Booking, SessionType } from '../../types';
import { Avatar } from '../ui/Avatar';
import { AvailabilityPicker } from '../ui/AvailabilityPicker';
import { Modal } from '../ui/Modal';
import { Stepper } from '../ui/Stepper';

const STEPS = ['Topic & Mode', 'Date & Notes', 'Payment', 'Confirmed'];

export function BookingModal() {
  const {
    bookingPrefill,
    closeBookingModal,
    tutors,
    user,
    createBooking,
    navigate,
    openSessionRoom,
  } = useApp();

  const tutor = tutors.find((t) => t.id === bookingPrefill?.tutorId);

  const [step, setStep] = useState(0);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [sessionType, setSessionType] = useState<SessionType>('1-on-1');
  const [mode, setMode] = useState<'online' | 'offline'>('online');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [durationHours, setDurationHours] = useState(1);
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState(user.payoutUpi || 'student@okicici');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!tutor || !bookingPrefill) return;
    setStep(0);
    setConfirmedBooking(null);
    setSubject(bookingPrefill.subject || tutor.subjects[0] || 'DSA');
    setTopic('');
    setSessionType('1-on-1');
    setMode(tutor.mode === 'offline' ? 'offline' : 'online');
    const firstAvail = tutor.availability.find((a) => a.slots.length > 0);
    setSelectedDay(bookingPrefill.day || firstAvail?.day || 'Mon');
    setSelectedSlot(bookingPrefill.slot || firstAvail?.slots[0] || '18:00');
    setDurationHours(1);
    setNote('');
  }, [tutor, bookingPrefill]);

  if (!bookingPrefill || !tutor) return null;

  const rate = sessionType === '1-on-1' ? tutor.hourlyRate : tutor.groupHourlyRate;
  const subtotal = Math.round(rate * durationHours * 100) / 100;
  const platformFee = 1;
  const totalAmount = subtotal + platformFee;

  const handleConfirmPayment = () => {
    const created = createBooking({
      tutorId: tutor.id,
      tutorName: tutor.name,
      tutorCollege: tutor.college,
      tutorAvatar: tutor.avatar,
      tutorInitials: tutor.initials,
      learnerName: user.name,
      learnerCollege: user.college,
      subject,
      topic: topic.trim() || `${subject} Guided Practice`,
      sessionType,
      mode,
      date: `Upcoming ${selectedDay}`,
      timeSlot: selectedSlot,
      durationHours,
      totalAmount,
      note: note.trim() || 'Looking forward to reviewing core concepts and practice problems.',
      meetingLink: mode === 'online' ? `https://peerlearn.meet/room/${tutor.id}-${Date.now().toString().slice(-4)}` : undefined,
      meetupLocation: mode === 'offline' ? tutor.campusMeetupSpot || `${tutor.college} Main Library` : undefined,
    });
    setConfirmedBooking(created);
    setStep(3);
  };

  const handleDownloadCalendar = () => {
    if (!confirmedBooking) return;
    const ics = peerLearnService.buildCalendarIcs(confirmedBooking);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `peerlearn-${confirmedBooking.subject.toLowerCase().replace(/\s+/g, '-')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      open={Boolean(bookingPrefill)}
      onClose={closeBookingModal}
      title={step === 3 ? 'Session Confirmed' : `Book Session with ${tutor.name}`}
      subtitle={step < 3 ? `${tutor.college} · ${tutor.course}` : undefined}
      maxWidth="lg"
    >
      <div className="space-y-6">
        <Stepper steps={STEPS} currentStep={step} />

        {/* Step 0: Subject, Topic, Session Type & Mode */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-stone-50 dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38]">
              <Avatar
                src={tutor.avatar}
                alt={tutor.name}
                initials={tutor.initials}
                tone={tutor.avatarTone}
                size="md"
              />
              <div>
                <p className="text-sm font-semibold text-[#141413] dark:text-slate-100">
                  {tutor.name}
                </p>
                <p className="text-xs text-[#5F5D57] dark:text-slate-400">
                  {tutor.responseTime} · ${tutor.hourlyRate}/hr 1-on-1
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-1.5">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
                >
                  {tutor.subjects.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-1.5">
                  Duration
                </label>
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
                >
                  <option value={1}>60 minutes (1 hr)</option>
                  <option value={1.5}>90 minutes (1.5 hrs)</option>
                  <option value={2}>120 minutes (2 hrs)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-1.5">
                Specific topic or assignment
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={`e.g. ${subject} midterm problem set or recursion lab`}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-1.5">
                  Session Type
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSessionType('1-on-1')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      sessionType === '1-on-1'
                        ? 'border-[#5B4BFF] bg-[#5B4BFF]/10 text-[#141413] dark:text-white'
                        : 'border-[#E6E4DF] dark:border-[#272B38] text-[#5F5D57] dark:text-slate-400'
                    }`}
                  >
                    <p className="text-sm font-semibold">1-on-1</p>
                    <p className="text-xs tabular-nums">${tutor.hourlyRate}/hr</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionType('group')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      sessionType === 'group'
                        ? 'border-[#5B4BFF] bg-[#5B4BFF]/10 text-[#141413] dark:text-white'
                        : 'border-[#E6E4DF] dark:border-[#272B38] text-[#5F5D57] dark:text-slate-400'
                    }`}
                  >
                    <p className="text-sm font-semibold">Small Group</p>
                    <p className="text-xs tabular-nums">${tutor.groupHourlyRate}/hr</p>
                  </button>
                </div>
              </div>

              <div>
                <span className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-1.5">
                  Format
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={tutor.mode === 'offline'}
                    onClick={() => setMode('online')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      mode === 'online'
                        ? 'border-[#5B4BFF] bg-[#5B4BFF]/10 text-[#141413] dark:text-white'
                        : 'border-[#E6E4DF] dark:border-[#272B38] text-[#5F5D57] dark:text-slate-400 disabled:opacity-40'
                    }`}
                  >
                    <Video className="w-4 h-4 mb-1 text-[#5B4BFF]" />
                    <p className="text-sm font-semibold">Online</p>
                  </button>
                  <button
                    type="button"
                    disabled={tutor.mode === 'online'}
                    onClick={() => setMode('offline')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      mode === 'offline'
                        ? 'border-[#5B4BFF] bg-[#5B4BFF]/10 text-[#141413] dark:text-white'
                        : 'border-[#E6E4DF] dark:border-[#272B38] text-[#5F5D57] dark:text-slate-400 disabled:opacity-40'
                    }`}
                  >
                    <MapPin className="w-4 h-4 mb-1 text-amber-500" />
                    <p className="text-sm font-semibold">Campus</p>
                  </button>
                </div>
              </div>
            </div>

            {mode === 'offline' && (
              <p className="text-xs text-[#5F5D57] dark:text-slate-400 px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38]">
                Suggested meetup spot: <strong className="text-[#141413] dark:text-slate-200">{tutor.campusMeetupSpot || `${tutor.college} Main Library`}</strong>
              </p>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 text-sm font-medium rounded-xl bg-[#5B4BFF] text-white hover:bg-[#4A3AE8] transition-colors"
              >
                Continue to Date & Time
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Date, Slot & Notes */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-3">
                Select an available day and time slot
              </p>
              <AvailabilityPicker
                availability={tutor.availability}
                selectedDay={selectedDay}
                selectedSlot={selectedSlot}
                onSelectSlot={(day, slot) => {
                  setSelectedDay(day);
                  setSelectedSlot(slot);
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-1.5">
                What do you need help with?
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Share where you're getting stuck, textbook chapter, or paste specific questions..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-200"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 text-sm font-medium rounded-xl bg-[#5B4BFF] text-white hover:bg-[#4A3AE8] transition-colors"
              >
                Review & Pay
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Price Summary & Payment */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#5F5D57] dark:text-slate-400">
                  {subject} ({sessionType}, {mode}) · {selectedDay} at {selectedSlot}
                </span>
                <span className="font-mono tabular-nums text-[#141413] dark:text-slate-100">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F5D57] dark:text-slate-400">
                  Student protection & platform fee
                </span>
                <span className="font-mono tabular-nums text-[#141413] dark:text-slate-100">
                  ${platformFee.toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t border-[#E6E4DF] dark:border-[#272B38] flex justify-between font-semibold">
                <span className="text-[#141413] dark:text-slate-100">Total due</span>
                <span className="font-mono tabular-nums text-base text-[#5B4BFF] dark:text-[#9D94FF]">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400">
                Payment method
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-left ${
                    paymentMethod === 'upi'
                      ? 'border-[#5B4BFF] bg-[#5B4BFF]/10 text-[#141413] dark:text-white'
                      : 'border-[#E6E4DF] dark:border-[#272B38] text-[#5F5D57] dark:text-slate-400'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#5B4BFF]" />
                  <div>
                    <p className="text-sm font-semibold">UPI / Instant</p>
                    <p className="text-xs opacity-75">Zero gateway surcharge</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-left ${
                    paymentMethod === 'card'
                      ? 'border-[#5B4BFF] bg-[#5B4BFF]/10 text-[#141413] dark:text-white'
                      : 'border-[#E6E4DF] dark:border-[#272B38] text-[#5F5D57] dark:text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-amber-500" />
                  <div>
                    <p className="text-sm font-semibold">Debit / Credit Card</p>
                    <p className="text-xs opacity-75">Visa •••• 4242</p>
                  </div>
                </button>
              </div>

              {paymentMethod === 'upi' ? (
                <div>
                  <label className="block text-xs text-[#5F5D57] dark:text-slate-400 mb-1">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    defaultValue="4242 •••• •••• 4242"
                    aria-label="Card number"
                    className="col-span-2 px-3.5 py-2.5 text-sm font-mono rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
                  />
                  <input
                    type="text"
                    defaultValue="09/28"
                    aria-label="Expiry date"
                    className="px-3.5 py-2.5 text-sm font-mono rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
                  />
                  <input
                    type="text"
                    defaultValue="842"
                    aria-label="CVC"
                    className="px-3.5 py-2.5 text-sm font-mono rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-200"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="px-5 py-2.5 text-sm font-medium rounded-xl bg-[#5B4BFF] text-white hover:bg-[#4A3AE8] transition-colors tabular-nums"
              >
                Confirm & Pay ${totalAmount.toFixed(2)}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation Screen */}
        {step === 3 && confirmedBooking && (
          <div className="text-center space-y-5 py-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-[#141413] dark:text-slate-100">
                You’re booked with {confirmedBooking.tutorName}!
              </h3>
              <p className="mt-1 text-sm text-[#5F5D57] dark:text-slate-400">
                {confirmedBooking.subject} · {confirmedBooking.date} at {confirmedBooking.timeSlot} ({confirmedBooking.mode})
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-left text-xs space-y-1.5 text-[#3E3D38] dark:text-slate-300">
              <p>
                <strong>Topic:</strong> {confirmedBooking.topic}
              </p>
              <p>
                <strong>{confirmedBooking.mode === 'online' ? 'Meeting room:' : 'Campus spot:'}</strong>{' '}
                {confirmedBooking.meetingLink || confirmedBooking.meetupLocation}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadCalendar}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100 hover:bg-stone-100 dark:hover:bg-slate-800"
              >
                <CalendarPlus className="w-4 h-4 text-[#5B4BFF]" />
                Add to Calendar
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = confirmedBooking.id;
                  closeBookingModal();
                  openSessionRoom(id);
                }}
                className="px-4 py-2.5 text-sm font-medium rounded-xl bg-[#5B4BFF] text-white hover:bg-[#4A3AE8]"
              >
                Open Session Room
              </button>
              <button
                type="button"
                onClick={() => {
                  closeBookingModal();
                  navigate('learner-dashboard');
                }}
                className="px-4 py-2.5 text-sm font-medium text-[#5F5D57] dark:text-slate-400 hover:text-[#141413] dark:hover:text-white"
              >
                View Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
