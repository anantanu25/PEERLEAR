import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Atom,
  BookOpen,
  Calculator,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  FlaskConical,
  LineChart,
  Search,
  ShieldCheck,
  Sigma,
  Users,
  Wallet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  COLLEGES,
  HERO_STUDY_IMAGE,
  POPULAR_SUBJECTS,
  TESTIMONIALS,
} from '../data/mockData';
import { TutorCard } from '../components/ui/TutorCard';

const SUBJECT_ICON_MAP: Record<string, React.ReactNode> = {
  DSA: <Code2 className="w-5 h-5" />,
  Calculus: <Sigma className="w-5 h-5" />,
  Physics: <Atom className="w-5 h-5" />,
  DBMS: <Database className="w-5 h-5" />,
  Economics: <LineChart className="w-5 h-5" />,
  'Machine Learning': <Cpu className="w-5 h-5" />,
  'Linear Algebra': <Calculator className="w-5 h-5" />,
  'Organic Chemistry': <FlaskConical className="w-5 h-5" />,
};

export function LandingPage() {
  const {
    tutors,
    applyLandingSearch,
    navigate,
    openAuth,
    openTutorProfile,
    openBookingModal,
    savedTutorIds,
    toggleSavedTutor,
    setFilters,
  } = useApp();

  const [subjectQuery, setSubjectQuery] = useState('');
  const [college, setCollege] = useState('All');
  const [mode, setMode] = useState<'all' | 'online' | 'offline'>('all');
  const [howItWorksTab, setHowItWorksTab] = useState<'learner' | 'tutor'>('learner');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [heroImgError, setHeroImgError] = useState(false);

  const featuredTutors = tutors.filter((t) => t.featured);
  const visibleCount = 3;
  const maxIndex = Math.max(0, featuredTutors.length - visibleCount);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyLandingSearch(subjectQuery, college, mode);
  };

  const handleSubjectClick = (subj: string) => {
    setFilters((prev) => ({ ...prev, subject: subj, query: '' }));
    navigate('find-tutors');
  };

  return (
    <div className="space-y-20 pb-10">
      {/* Hero Section */}
      <section className="pt-8 sm:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-[#141413] dark:text-white leading-[1.12] text-balance">
                Learn from students who’ve been where you are
              </h1>
              <p className="text-base sm:text-lg text-[#5F5D57] dark:text-slate-300 leading-relaxed max-w-xl">
                Connect with verified college tutors across campuses for 1-on-1 problem-set walkthroughs, lab debugging, and calm exam prep—online or at your campus library.
              </p>

              {/* Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="p-2 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-2"
              >
                <div className="sm:col-span-5 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-stone-50 dark:bg-[#1E222E]">
                  <Search className="w-4 h-4 text-[#5F5D57] dark:text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={subjectQuery}
                    onChange={(e) => setSubjectQuery(e.target.value)}
                    placeholder="Subject or topic (e.g. DSA, Calculus)"
                    aria-label="Search subject or topic"
                    className="w-full bg-transparent text-sm text-[#141413] dark:text-slate-100 placeholder:text-[#5F5D57] dark:placeholder:text-slate-400 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-4 px-2 py-2 rounded-xl bg-stone-50 dark:bg-[#1E222E]">
                  <select
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    aria-label="Filter by college"
                    className="w-full bg-transparent text-sm text-[#141413] dark:text-slate-100 focus:outline-none"
                  >
                    <option value="All">Any college</option>
                    {COLLEGES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3 px-2 py-2 rounded-xl bg-stone-50 dark:bg-[#1E222E]">
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as 'all' | 'online' | 'offline')}
                    aria-label="Select session mode"
                    className="w-full bg-transparent text-sm text-[#141413] dark:text-slate-100 focus:outline-none"
                  >
                    <option value="all">Online & Campus</option>
                    <option value="online">Online only</option>
                    <option value="offline">In-person campus</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="sm:col-span-12 py-3 px-5 rounded-xl bg-[#5B4BFF] text-white text-sm font-semibold hover:bg-[#4A3AE8] transition-colors flex items-center justify-center gap-2"
                >
                  <span>Search Verified Tutors</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => navigate('find-tutors')}
                  className="px-5 py-2.5 rounded-xl bg-[#141413] dark:bg-white text-white dark:text-[#141413] text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  Find a Tutor
                </button>
                <button
                  type="button"
                  onClick={() => openAuth('signup', 'tutor')}
                  className="px-5 py-2.5 rounded-xl border border-[#E6E4DF] dark:border-[#272B38] bg-white dark:bg-[#171A23] text-[#141413] dark:text-slate-100 text-sm font-semibold hover:border-[#5B4BFF] transition-colors whitespace-nowrap"
                >
                  Become a Tutor
                </button>
              </div>
            </div>

            {/* Hero Image Card */}
            <div className="lg:col-span-5 flex">
              <div className="w-full rounded-2xl overflow-hidden border border-[#E6E4DF] dark:border-[#272B38] bg-stone-100 dark:bg-[#171A23] min-h-[280px] lg:min-h-[380px] relative">
                {!heroImgError ? (
                  <img
                    src={HERO_STUDY_IMAGE}
                    alt="Two college students studying calculus together at a sunlit library oak table"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-indigo-50 to-amber-50 dark:from-slate-800 dark:to-slate-900">
                    <BookOpen className="w-10 h-10 text-[#5B4BFF] mb-3" />
                    <p className="text-sm font-medium text-[#141413] dark:text-slate-200">
                      Peer study sessions across 48+ colleges
                    </p>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                  <p className="text-xs font-medium text-amber-300">
                    4.93 average rating across 18,900+ completed sessions
                  </p>
                  <p className="text-sm font-medium mt-0.5">
                    Real help from seniors & TAs who recently aced the exact syllabus.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Strip */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 border-y border-[#E6E4DF] dark:border-[#272B38] py-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#5B4BFF] shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#141413] dark:text-slate-100">
                  Verified student tutors
                </p>
                <p className="text-xs text-[#5F5D57] dark:text-slate-400">
                  Every tutor confirms college email and student ID
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#141413] dark:text-slate-100">
                  Multi-college network
                </p>
                <p className="text-xs text-[#5F5D57] dark:text-slate-400">
                  Learn from top peers at IITs, NITs, UC campuses & more
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#141413] dark:text-slate-100">
                  You set your own rates
                </p>
                <p className="text-xs text-[#5F5D57] dark:text-slate-400">
                  Transparent student-friendly hourly & group pricing
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Subjects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#141413] dark:text-white">
              Popular college subjects
            </h2>
            <p className="mt-1 text-sm text-[#5F5D57] dark:text-slate-400">
              Jump straight into verified peer tutors by course area.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('find-tutors')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5B4BFF] dark:text-[#9D94FF] hover:underline"
          >
            <span>Browse all 15 subjects</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_SUBJECTS.map((subj) => (
            <button
              key={subj.name}
              type="button"
              onClick={() => handleSubjectClick(subj.name)}
              className="group text-left p-5 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl hover:border-[#5B4BFF] hover:-translate-y-0.5 transition-all duration-150"
            >
              <div className="w-10 h-10 rounded-xl bg-[#5B4BFF]/10 text-[#5B4BFF] dark:text-[#9D94FF] flex items-center justify-center mb-4">
                {SUBJECT_ICON_MAP[subj.name] || <BookOpen className="w-5 h-5" />}
              </div>
              <h3 className="text-base font-display font-semibold text-[#141413] dark:text-slate-100 group-hover:text-[#5B4BFF] dark:group-hover:text-[#9D94FF]">
                {subj.name}
              </h3>
              <p className="mt-1 text-xs text-[#5F5D57] dark:text-slate-400">
                {subj.fullName} · <span className="tabular-nums">{subj.count} tutors</span>
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Tutors Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#141413] dark:text-white">
              Featured peer tutors
            </h2>
            <p className="mt-1 text-sm text-[#5F5D57] dark:text-slate-400">
              Top-rated teaching assistants, honors fellows, and senior mentors.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCarouselIndex((prev) => Math.max(0, prev - 1))}
              disabled={carouselIndex === 0}
              aria-label="Previous featured tutors"
              className="p-2.5 rounded-xl border border-[#E6E4DF] dark:border-[#272B38] bg-white dark:bg-[#171A23] text-[#141413] dark:text-slate-200 disabled:opacity-40 hover:border-[#5B4BFF]"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCarouselIndex((prev) => Math.min(maxIndex, prev + 1))}
              disabled={carouselIndex >= maxIndex}
              aria-label="Next featured tutors"
              className="p-2.5 rounded-xl border border-[#E6E4DF] dark:border-[#272B38] bg-white dark:bg-[#171A23] text-[#141413] dark:text-slate-200 disabled:opacity-40 hover:border-[#5B4BFF]"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredTutors
            .slice(carouselIndex, carouselIndex + visibleCount)
            .map((tutor) => (
              <TutorCard
                key={tutor.id}
                tutor={tutor}
                saved={savedTutorIds.includes(tutor.id)}
                onToggleSave={toggleSavedTutor}
                onViewProfile={openTutorProfile}
                onBookSession={(id) => openBookingModal({ tutorId: id })}
                onSubjectClick={handleSubjectClick}
              />
            ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <div className="bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#141413] dark:text-white">
                How PeerLearn works
              </h2>
              <p className="mt-1 text-sm text-[#5F5D57] dark:text-slate-400">
                Built around busy semester schedules—no long-term commitments.
              </p>
            </div>
            <div className="inline-flex p-1 bg-stone-100 dark:bg-[#1E222E] rounded-xl border border-[#E6E4DF] dark:border-[#272B38]">
              <button
                type="button"
                onClick={() => setHowItWorksTab('learner')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  howItWorksTab === 'learner'
                    ? 'bg-white dark:bg-[#171A23] text-[#141413] dark:text-white shadow-xs'
                    : 'text-[#5F5D57] dark:text-slate-400'
                }`}
              >
                For Learners
              </button>
              <button
                type="button"
                onClick={() => setHowItWorksTab('tutor')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  howItWorksTab === 'tutor'
                    ? 'bg-white dark:bg-[#171A23] text-[#141413] dark:text-white shadow-xs'
                    : 'text-[#5F5D57] dark:text-slate-400'
                }`}
              >
                For Tutors
              </button>
            </div>
          </div>

          {howItWorksTab === 'learner' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="text-xs font-mono font-semibold text-[#5B4BFF] dark:text-[#9D94FF]">
                  01. Search & Compare
                </p>
                <h3 className="mt-2 text-lg font-display font-semibold text-[#141413] dark:text-slate-100">
                  Pick a peer who knows your syllabus
                </h3>
                <p className="mt-2 text-sm text-[#5F5D57] dark:text-slate-400 leading-relaxed">
                  Filter by subject, college, hourly rate, and ratings. Check verified teaching styles and real student reviews before booking.
                </p>
              </div>
              <div>
                <p className="text-xs font-mono font-semibold text-[#5B4BFF] dark:text-[#9D94FF]">
                  02. Book in 60 Seconds
                </p>
                <h3 className="mt-2 text-lg font-display font-semibold text-[#141413] dark:text-slate-100">
                  Choose online call or campus meetup
                </h3>
                <p className="mt-2 text-sm text-[#5F5D57] dark:text-slate-400 leading-relaxed">
                  Grab an open 1-on-1 or small group slot, attach what you’re stuck on, and confirm via instant UPI or card checkout.
                </p>
              </div>
              <div>
                <p className="text-xs font-mono font-semibold text-[#5B4BFF] dark:text-[#9D94FF]">
                  03. Solve Together
                </p>
                <h3 className="mt-2 text-lg font-display font-semibold text-[#141413] dark:text-slate-100">
                  Join your study room with shared notes
                </h3>
                <p className="mt-2 text-sm text-[#5F5D57] dark:text-slate-400 leading-relaxed">
                  Work through concepts at your own pace with shared live notes or meet at your library study pod—and rebook anytime.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
                  01. Verify Student Status
                </p>
                <h3 className="mt-2 text-lg font-display font-semibold text-[#141413] dark:text-slate-100">
                  Sign up with your .edu or .ac email
                </h3>
                <p className="mt-2 text-sm text-[#5F5D57] dark:text-slate-400 leading-relaxed">
                  Upload a quick photo of your college ID card, pick the subjects you’ve excelled in, and get verified within 24 hours.
                </p>
              </div>
              <div>
                <p className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
                  02. Set Rates & Hours
                </p>
                <h3 className="mt-2 text-lg font-display font-semibold text-[#141413] dark:text-slate-100">
                  Complete control over your calendar
                </h3>
                <p className="mt-2 text-sm text-[#5F5D57] dark:text-slate-400 leading-relaxed">
                  Choose your 1-on-1 and group hourly rate, mark open evening or weekend slots, and accept only requests that fit your week.
                </p>
              </div>
              <div>
                <p className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
                  03. Teach & Get Paid
                </p>
                <h3 className="mt-2 text-lg font-display font-semibold text-[#141413] dark:text-slate-100">
                  Fast weekly payouts to UPI or bank
                </h3>
                <p className="mt-2 text-sm text-[#5F5D57] dark:text-slate-400 leading-relaxed">
                  Build reviews across campuses, sharpen your own core mastery, and track earnings directly from your Tutor Dashboard.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats + Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl">
            <p className="text-3xl sm:text-4xl font-display font-bold text-[#5B4BFF] dark:text-[#9D94FF] tabular-nums">
              1,420+
            </p>
            <p className="mt-1 text-sm font-medium text-[#141413] dark:text-slate-100">
              Verified peer tutors
            </p>
            <p className="text-xs text-[#5F5D57] dark:text-slate-400 mt-0.5">
              ID-checked undergrads, TAs, and grad students
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl">
            <p className="text-3xl sm:text-4xl font-display font-bold text-[#141413] dark:text-white tabular-nums">
              18,900+
            </p>
            <p className="mt-1 text-sm font-medium text-[#141413] dark:text-slate-100">
              Sessions completed
            </p>
            <p className="text-xs text-[#5F5D57] dark:text-slate-400 mt-0.5">
              Across problem sets, labs, and finals prep
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl">
            <p className="text-3xl sm:text-4xl font-display font-bold text-amber-600 dark:text-amber-400 tabular-nums">
              48+
            </p>
            <p className="mt-1 text-sm font-medium text-[#141413] dark:text-slate-100">
              Colleges connected
            </p>
            <p className="text-xs text-[#5F5D57] dark:text-slate-400 mt-0.5">
              Cross-campus online & local library meetups
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.name}
              className="p-6 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl flex flex-col justify-between gap-5"
            >
              <p className="text-sm leading-relaxed text-[#3E3D38] dark:text-slate-300">
                “{t.quote}”
              </p>
              <div className="pt-4 border-t border-[#E6E4DF] dark:border-[#272B38]">
                <p className="text-sm font-semibold text-[#141413] dark:text-slate-100">
                  {t.name}
                </p>
                <p className="text-xs text-[#5F5D57] dark:text-slate-400">
                  {t.role} · {t.college}
                </p>
                <p className="mt-1 text-xs font-medium text-[#5B4BFF] dark:text-[#9D94FF] tabular-nums">
                  {t.outcome}
                </p>
              </div>
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  );
}
