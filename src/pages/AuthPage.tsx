import React, { useState } from 'react';
import { CheckCircle2, Mail, ShieldCheck, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_SUBJECTS, COLLEGES, SAMPLE_ID_IMAGE } from '../data/mockData';
import { UserRole } from '../types';
import { SubjectChip } from '../components/ui/SubjectChip';

export function AuthPage() {
  const { authInitialMode, authInitialRole, completeAuth, user, addToast } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>(authInitialMode);
  const [role, setRole] = useState<UserRole>(authInitialRole);
  const [name, setName] = useState(mode === 'login' ? user.name : '');
  const [email, setEmail] = useState(mode === 'login' ? user.email : '');
  const [collegeSearch, setCollegeSearch] = useState('');
  const [selectedCollege, setSelectedCollege] = useState(user.college);
  const [course, setCourse] = useState('B.Tech Computer Science');
  const [yearOfStudy, setYearOfStudy] = useState('2nd Year');

  // OTP Verification state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);

  // Tutor onboarding step
  const [idUploaded, setIdUploaded] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['DSA', 'Python']);
  const [hourlyRate, setHourlyRate] = useState(15);
  const [bio, setBio] = useState('');

  const filteredColleges = COLLEGES.filter((c) =>
    c.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  const handleSendOtp = () => {
    if (!email.includes('@')) {
      addToast('Enter a valid college email', 'Use your .edu or .ac.in address.', 'error');
      return;
    }
    setOtpSent(true);
    addToast('Verification code sent', 'Demo OTP code: 482910', 'info');
  };

  const handleVerifyOtp = () => {
    if (otpCode.trim().length < 4) {
      addToast('Enter the 6-digit OTP', 'Use 482910 for demo verification.', 'warning');
      return;
    }
    setEmailVerified(true);
    addToast('College email verified', 'Your campus domain is confirmed.');
  };

  const toggleSubject = (subj: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      completeAuth({
        email: email || user.email,
        role,
      });
      return;
    }

    if (!name.trim()) {
      addToast('Full name is required', undefined, 'error');
      return;
    }

    completeAuth(
      {
        name: name.trim(),
        email: email.trim() || 'student@college.edu',
        college: selectedCollege,
        course,
        yearOfStudy,
        role,
        subjectsTaught: role === 'tutor' ? selectedSubjects : user.subjectsTaught,
        hourlyRate: role === 'tutor' ? hourlyRate : user.hourlyRate,
        bio: bio.trim() || user.bio,
        tutorVerified: role === 'tutor' ? false : user.tutorVerified,
      },
      role === 'tutor'
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E6E4DF] dark:border-[#272B38] pb-5">
          <div>
            <h1 className="text-2xl font-display font-bold text-[#141413] dark:text-white">
              {mode === 'signup' ? 'Create your PeerLearn account' : 'Welcome back to PeerLearn'}
            </h1>
            <p className="mt-1 text-sm text-[#5F5D57] dark:text-slate-400">
              Verified campus access keeps every session safe and student-focused.
            </p>
          </div>
          <div className="inline-flex p-1 bg-stone-100 dark:bg-[#1E222E] rounded-xl border border-[#E6E4DF] dark:border-[#272B38]">
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg ${
                mode === 'signup'
                  ? 'bg-white dark:bg-[#171A23] text-[#141413] dark:text-white shadow-xs'
                  : 'text-[#5F5D57] dark:text-slate-400'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg ${
                mode === 'login'
                  ? 'bg-white dark:bg-[#171A23] text-[#141413] dark:text-white shadow-xs'
                  : 'text-[#5F5D57] dark:text-slate-400'
              }`}
            >
              Login
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div>
            <span className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-2">
              I want to join as
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('learner')}
                className={`p-4 rounded-xl border text-left transition-colors ${
                  role === 'learner'
                    ? 'border-[#5B4BFF] bg-[#5B4BFF]/10'
                    : 'border-[#E6E4DF] dark:border-[#272B38]'
                }`}
              >
                <p className="text-sm font-display font-semibold text-[#141413] dark:text-white">
                  Learner
                </p>
                <p className="text-xs text-[#5F5D57] dark:text-slate-400 mt-0.5">
                  Find verified student tutors & book 1-on-1 or group help
                </p>
              </button>
              <button
                type="button"
                onClick={() => setRole('tutor')}
                className={`p-4 rounded-xl border text-left transition-colors ${
                  role === 'tutor'
                    ? 'border-[#5B4BFF] bg-[#5B4BFF]/10'
                    : 'border-[#E6E4DF] dark:border-[#272B38]'
                }`}
              >
                <p className="text-sm font-display font-semibold text-[#141413] dark:text-white">
                  Tutor
                </p>
                <p className="text-xs text-[#5F5D57] dark:text-slate-400 mt-0.5">
                  Teach courses you’ve mastered & set your own hourly rates
                </p>
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-1.5">
                  Year of study
                </label>
                <select
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
                >
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                  <option>Masters</option>
                  <option>PhD</option>
                </select>
              </div>
            </div>
          )}

          {/* College Email & OTP */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400">
              College email (.edu / .ac)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-[#5F5D57] absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailVerified(false);
                  }}
                  placeholder="you@university.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
                />
              </div>
              {mode === 'signup' && !emailVerified && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-[#5B4BFF] text-[#5B4BFF] dark:text-[#9D94FF] hover:bg-[#5B4BFF]/10 whitespace-nowrap"
                >
                  {otpSent ? 'Resend OTP' : 'Send Verification OTP'}
                </button>
              )}
              {emailVerified && (
                <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified
                </span>
              )}
            </div>

            {mode === 'signup' && otpSent && !emailVerified && (
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex-1">
                  <p className="text-xs font-medium text-[#141413] dark:text-slate-200">
                    Enter 6-digit OTP sent to {email} <span className="text-[#5F5D57]">(demo: 482910)</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="482910"
                    maxLength={6}
                    className="w-28 px-3 py-2 text-sm font-mono rounded-xl bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#5B4BFF] text-white"
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}
          </div>

          {mode === 'signup' && (
            <>
              {/* College Dropdown with Search */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-1.5">
                    Search & select college
                  </label>
                  <input
                    type="text"
                    value={collegeSearch}
                    onChange={(e) => setCollegeSearch(e.target.value)}
                    placeholder="Filter college list..."
                    className="w-full px-3.5 py-2 text-xs rounded-t-xl bg-stone-50 dark:bg-[#1E222E] border border-b-0 border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
                  />
                  <select
                    value={selectedCollege}
                    onChange={(e) => setSelectedCollege(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-b-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
                  >
                    {filteredColleges.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-1.5">
                    Course / Major
                  </label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g. B.S. Computer Science"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Tutor Extra Onboarding Step */}
              {role === 'tutor' && (
                <div className="pt-5 border-t border-[#E6E4DF] dark:border-[#272B38] space-y-5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#5B4BFF]" />
                    <h2 className="text-base font-display font-semibold text-[#141413] dark:text-slate-100">
                      Tutor Verification Details
                    </h2>
                  </div>

                  <div>
                    <span className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-2">
                      Upload College ID card
                    </span>
                    <div className="p-4 rounded-xl border border-dashed border-[#E6E4DF] dark:border-[#272B38] bg-stone-50 dark:bg-[#1E222E] flex flex-col sm:flex-row items-center justify-between gap-4">
                      {idUploaded ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={SAMPLE_ID_IMAGE}
                            alt="Uploaded college ID preview"
                            referrerPolicy="no-referrer"
                            className="w-20 h-14 object-cover rounded-lg border border-[#E6E4DF] dark:border-[#272B38]"
                          />
                          <div>
                            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                              Student_ID_Front.jpg attached
                            </p>
                            <p className="text-xs text-[#5F5D57] dark:text-slate-400">
                              Ready for manual & domain review
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-[#5F5D57] dark:text-slate-400">
                          Clear photo showing your name, photo, and university crest.
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => setIdUploaded(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100 hover:border-[#5B4BFF] shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{idUploaded ? 'Replace ID Photo' : 'Attach Sample ID'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-2">
                      Subjects you can tutor ({selectedSubjects.length} selected)
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {ALL_SUBJECTS.map((subj) => (
                        <SubjectChip
                          key={subj}
                          label={subj}
                          active={selectedSubjects.includes(subj)}
                          onClick={() => toggleSubject(subj)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-1.5">
                        Hourly rate ($/hr)
                      </label>
                      <input
                        type="number"
                        min={5}
                        max={60}
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-1.5">
                        Short teaching bio
                      </label>
                      <input
                        type="text"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Share relevant TA experience, grades, and how you teach..."
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => completeAuth({ role })}
              className="text-xs font-medium text-[#5F5D57] dark:text-slate-400 hover:text-[#5B4BFF]"
            >
              Quick enter with demo account →
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-[#5B4BFF] text-white hover:bg-[#4A3AE8] transition-colors"
            >
              {mode === 'signup'
                ? role === 'tutor'
                  ? 'Submit Tutor Application'
                  : 'Create Learner Account'
                : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
