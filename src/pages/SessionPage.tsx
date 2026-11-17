import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  MapPin,
  Mic,
  MicOff,
  MonitorUp,
  Pause,
  Play,
  RotateCcw,
  Video,
  VideoOff,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/ui/Avatar';
import { RatingStars } from '../components/ui/RatingStars';

export function SessionPage() {
  const {
    bookings,
    activeSessionId,
    updateBookingStatus,
    submitReview,
    navigate,
    addToast,
  } = useApp();

  const booking = bookings.find((b) => b.id === activeSessionId) || bookings[0];

  const [viewMode, setViewMode] = useState<'online' | 'offline'>(booking.mode);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [timerRunning, setTimerRunning] = useState(true);
  const [secondsElapsed, setSecondsElapsed] = useState(1420); // 23:40 into session
  const [sharedNotes, setSharedNotes] = useState(
    `Session Topic: ${booking.topic}\n\n1. State definition:\n   dp[u][0] = max sum in subtree of u when u is NOT picked\n   dp[u][1] = max sum in subtree of u when u IS picked\n\n2. Transition check:\n   - Remember to initialize leaf base cases before post-order DFS.\n   - Watch out for negative weights!`
  );
  const [checkedIn, setCheckedIn] = useState(false);
  const [showPostReview, setShowPostReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    setViewMode(booking.mode);
  }, [booking.mode]);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => {
      setSecondsElapsed((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleEndSession = () => {
    setTimerRunning(false);
    updateBookingStatus(booking.id, 'completed');
    setShowPostReview(true);
  };

  const handleSubmitPostReview = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview(
      booking.tutorId,
      booking.id,
      rating,
      booking.subject,
      reviewText.trim() || 'Clear, structured session and super friendly pace!'
    );
    navigate('learner-dashboard');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl p-5">
        <div className="flex items-center gap-3.5">
          <Avatar
            src={booking.tutorAvatar}
            alt={booking.tutorName}
            initials={booking.tutorInitials}
            size="md"
          />
          <div>
            <h1 className="text-lg font-display font-bold text-[#141413] dark:text-white">
              {booking.subject}: {booking.topic}
            </h1>
            <p className="text-xs text-[#5F5D57] dark:text-slate-400">
              with {booking.tutorName} ({booking.tutorCollege}) · {booking.date} at {booking.timeSlot}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Online / Offline View Switcher for demoing both */}
          <div className="inline-flex p-1 bg-stone-100 dark:bg-[#1E222E] rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('online')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                viewMode === 'online'
                  ? 'bg-white dark:bg-[#171A23] text-[#141413] dark:text-white shadow-xs'
                  : 'text-[#5F5D57] dark:text-slate-400'
              }`}
            >
              Online Call
            </button>
            <button
              type="button"
              onClick={() => setViewMode('offline')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                viewMode === 'offline'
                  ? 'bg-white dark:bg-[#171A23] text-[#141413] dark:text-white shadow-xs'
                  : 'text-[#5F5D57] dark:text-slate-400'
              }`}
            >
              Campus Meetup
            </button>
          </div>

          {/* Session Timer */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38]">
            <span className="font-mono text-sm font-semibold text-[#141413] dark:text-white tabular-nums">
              {formatTimer(secondsElapsed)}
            </span>
            <button
              type="button"
              onClick={() => setTimerRunning((r) => !r)}
              aria-label={timerRunning ? 'Pause timer' : 'Resume timer'}
              className="p-1 text-[#5B4BFF] dark:text-[#9D94FF]"
            >
              {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => setSecondsElapsed(0)}
              aria-label="Reset timer"
              className="p-1 text-[#5F5D57] dark:text-slate-400"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleEndSession}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 text-white hover:bg-amber-600"
          >
            End & Review Session
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      {!showPostReview ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left 7 cols: Video Call OR Campus Meetup */}
          <div className="lg:col-span-7 flex flex-col">
            {viewMode === 'online' ? (
              <div className="flex-1 bg-[#14161F] text-white rounded-2xl border border-[#272B38] p-5 flex flex-col justify-between min-h-[420px]">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>PeerLearn HD Study Room</span>
                  <span className="font-mono">{screenShare ? 'Screen sharing active' : '720p · Encrypted'}</span>
                </div>

                <div className="my-6 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="h-full min-h-[190px] rounded-xl bg-[#1D202D] border border-slate-700/60 flex flex-col items-center justify-center p-4">
                    <Avatar
                      src={booking.tutorAvatar}
                      alt={booking.tutorName}
                      initials={booking.tutorInitials}
                      size="xl"
                    />
                    <p className="mt-3 text-sm font-semibold">{booking.tutorName}</p>
                    <p className="text-xs text-slate-400">Tutor · Mic on</p>
                  </div>

                  <div className="h-full min-h-[190px] rounded-xl bg-[#1D202D] border border-slate-700/60 flex flex-col items-center justify-center p-4">
                    <div className="w-20 h-20 rounded-full bg-[#5B4BFF]/20 text-[#9D94FF] flex items-center justify-center font-display text-xl font-bold">
                      YOU
                    </div>
                    <p className="mt-3 text-sm font-semibold">{booking.learnerName}</p>
                    <p className="text-xs text-slate-400">
                      {camOn ? 'Camera active' : 'Camera paused'} · {micOn ? 'Mic on' : 'Muted'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setMicOn((m) => !m)}
                    className={`p-3 rounded-xl border transition-colors ${
                      micOn
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-red-600 border-red-500 text-white'
                    }`}
                    aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
                  >
                    {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCamOn((c) => !c)}
                    className={`p-3 rounded-xl border transition-colors ${
                      camOn
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-red-600 border-red-500 text-white'
                    }`}
                    aria-label={camOn ? 'Turn off camera' : 'Turn on camera'}
                  >
                    {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setScreenShare((s) => !s);
                      addToast(
                        !screenShare ? 'Screen share started' : 'Screen share stopped',
                        undefined,
                        'info'
                      );
                    }}
                    className={`px-4 py-3 rounded-xl border text-xs font-medium inline-flex items-center gap-2 ${
                      screenShare
                        ? 'bg-[#5B4BFF] border-[#5B4BFF] text-white'
                        : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  >
                    <MonitorUp className="w-4 h-4" />
                    <span>{screenShare ? 'Stop Sharing' : 'Share Screen'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl p-6 flex flex-col justify-between gap-5 min-h-[420px]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-display font-semibold text-[#141413] dark:text-white">
                      Campus Meetup Spot
                    </h2>
                    <p className="mt-1 text-sm text-[#5F5D57] dark:text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>
                        {booking.meetupLocation || `${booking.tutorCollege} Central Library, 2nd Floor Quiet Zone`}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckedIn(true);
                      addToast('Checked in', `${booking.tutorName} has been notified you arrived.`);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 ${
                      checkedIn
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#5B4BFF] text-white hover:bg-[#4A3AE8]'
                    }`}
                  >
                    {checkedIn ? 'Checked In ✓' : 'Check In at Library'}
                  </button>
                </div>

                {/* Clean Stylized Campus Map Diagram */}
                <div className="flex-1 rounded-xl bg-stone-100 dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] p-5 relative overflow-hidden flex items-center justify-center min-h-[240px]">
                  <svg
                    viewBox="0 0 420 200"
                    className="w-full h-full max-h-56 text-[#5F5D57] dark:text-slate-500"
                    aria-label="Campus library meetup map"
                  >
                    <rect x="20" y="25" width="120" height="65" rx="10" className="fill-white dark:fill-[#171A23] stroke-current" strokeWidth="1.5" />
                    <text x="80" y="62" textAnchor="middle" className="fill-current text-[11px] font-sans">Academic Quad</text>

                    <rect x="170" y="20" width="180" height="90" rx="12" className="fill-[#5B4BFF]/15 stroke-[#5B4BFF]" strokeWidth="2" />
                    <text x="260" y="55" textAnchor="middle" className="fill-[#5B4BFF] dark:fill-[#9D94FF] text-[12px] font-bold">Central Library</text>
                    <text x="260" y="75" textAnchor="middle" className="fill-current text-[10px]">2nd Floor · Table 14</text>
                    <circle cx="260" cy="95" r="6" className="fill-amber-500" />

                    <rect x="60" y="125" width="130" height="50" rx="10" className="fill-white dark:fill-[#171A23] stroke-current" strokeWidth="1.5" />
                    <text x="125" y="155" textAnchor="middle" className="fill-current text-[11px]">Student Commons Cafe</text>

                    <path d="M 140 58 L 170 58 M 190 150 L 260 150 L 260 110" fill="none" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1.5" />
                  </svg>
                </div>

                <p className="text-xs text-[#5F5D57] dark:text-slate-400">
                  Safety reminder: All in-person sessions take place in public campus libraries or student commons.
                </p>
              </div>
            )}
          </div>

          {/* Right 5 cols: Shared Study Notes */}
          <div className="lg:col-span-5 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-display font-semibold text-[#141413] dark:text-white">
                  Shared session notes
                </h2>
                <p className="text-xs text-[#5F5D57] dark:text-slate-400">
                  Synced automatically to both Learner & Tutor dashboards
                </p>
              </div>
              <button
                type="button"
                onClick={() => addToast('Notes saved', 'Exported to your session history.')}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E6E4DF] dark:border-[#272B38] hover:bg-stone-50 dark:hover:bg-slate-800"
              >
                Save Copy
              </button>
            </div>
            <textarea
              value={sharedNotes}
              onChange={(e) => setSharedNotes(e.target.value)}
              aria-label="Shared session notes"
              className="flex-1 min-h-[320px] w-full p-4 rounded-xl bg-stone-50 dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-sm font-mono leading-relaxed text-[#141413] dark:text-slate-100 resize-none"
            />
          </div>
        </div>
      ) : (
        /* Post-Session Rating & Review Form */
        <div className="max-w-xl mx-auto bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h2 className="text-xl font-display font-bold text-[#141413] dark:text-white">
                Session completed ({formatTimer(secondsElapsed)})
              </h2>
              <p className="text-xs text-[#5F5D57] dark:text-slate-400">
                Leave a quick review for {booking.tutorName}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitPostReview} className="space-y-4">
            <div>
              <span className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-2">
                Rating
              </span>
              <RatingStars rating={rating} interactive onChange={setRating} size="md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-1.5">
                How did {booking.tutorName.split(' ')[0]} help you?
              </label>
              <textarea
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share what clicked, teaching pace, or notes quality..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('learner-dashboard')}
                className="px-4 py-2 text-sm rounded-xl border border-[#E6E4DF] dark:border-[#272B38]"
              >
                Skip for now
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold rounded-xl bg-[#5B4BFF] text-white"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
