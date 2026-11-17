import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COLLEGES } from '../data/mockData';
import { Tabs } from '../components/ui/Tabs';

export function SettingsPage() {
  const { user, updateUserProfile, switchUserRole } = useApp();
  const [tab, setTab] = useState<'profile' | 'notifications' | 'payout' | 'privacy'>('profile');

  const [name, setName] = useState(user.name);
  const [college, setCollege] = useState(user.college);
  const [course, setCourse] = useState(user.course);
  const [yearOfStudy, setYearOfStudy] = useState(user.yearOfStudy);
  const [payoutUpi, setPayoutUpi] = useState(user.payoutUpi);
  const [notifPrefs, setNotifPrefs] = useState(user.notificationPrefs);
  const [privacyPrefs, setPrivacyPrefs] = useState(user.privacyPrefs);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#141413] dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[#5F5D57] dark:text-slate-400">
          Manage your campus profile, notification alerts, payout methods, and privacy.
        </p>
      </div>

      <Tabs
        activeId={tab}
        onChange={(id) => setTab(id as typeof tab)}
        tabs={[
          { id: 'profile', label: 'Profile' },
          { id: 'notifications', label: 'Notifications' },
          { id: 'payout', label: 'Payout' },
          { id: 'privacy', label: 'Privacy & Role' },
        ]}
      />

      <div className="bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl p-6 space-y-5">
        {tab === 'profile' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-1.5">
                  College
                </label>
                <select
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
                >
                  {COLLEGES.map((c) => (
                    <option key={c} value={c}>
                      {c}
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
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  updateUserProfile({ name, college, course, yearOfStudy })
                }
                className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-[#5B4BFF] text-white hover:bg-[#4A3AE8]"
              >
                Save Profile
              </button>
            </div>
          </>
        )}

        {tab === 'notifications' && (
          <div className="space-y-4">
            {[
              {
                key: 'sessionReminders' as const,
                title: 'Session reminders',
                desc: 'Get notified 30 minutes before an upcoming online or campus session.',
              },
              {
                key: 'newMessages' as const,
                title: 'Direct messages',
                desc: 'Alert when a peer tutor or student sends a chat message or PDF.',
              },
              {
                key: 'marketingTips' as const,
                title: 'Exam season study digests',
                desc: 'Weekly curated list of top peer tutors in your major.',
              },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-start justify-between gap-4 p-4 rounded-xl border border-[#E6E4DF] dark:border-[#272B38] cursor-pointer"
              >
                <div>
                  <p className="text-sm font-semibold text-[#141413] dark:text-slate-100">
                    {item.title}
                  </p>
                  <p className="text-xs text-[#5F5D57] dark:text-slate-400 mt-0.5">
                    {item.desc}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifPrefs[item.key]}
                  onChange={(e) =>
                    setNotifPrefs((prev) => ({ ...prev, [item.key]: e.target.checked }))
                  }
                  className="mt-1 w-4 h-4 accent-[#5B4BFF]"
                />
              </label>
            ))}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => updateUserProfile({ notificationPrefs: notifPrefs })}
                className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-[#5B4BFF] text-white"
              >
                Save Notification Preferences
              </button>
            </div>
          </div>
        )}

        {tab === 'payout' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-1.5">
                Primary UPI ID or Bank handle for tutor payouts
              </label>
              <input
                type="text"
                value={payoutUpi}
                onChange={(e) => setPayoutUpi(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
              />
            </div>
            <p className="text-xs text-[#5F5D57] dark:text-slate-400">
              Payouts clear every Friday or via instant withdrawal once a session is marked complete.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => updateUserProfile({ payoutUpi })}
                className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-[#5B4BFF] text-white"
              >
                Update Payout Destination
              </button>
            </div>
          </div>
        )}

        {tab === 'privacy' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-[#E6E4DF] dark:border-[#272B38] flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#141413] dark:text-slate-100">
                  Active workspace mode
                </p>
                <p className="text-xs text-[#5F5D57] dark:text-slate-400">
                  Currently viewing PeerLearn as a {user.role}.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  switchUserRole(user.role === 'learner' ? 'tutor' : 'learner')
                }
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#5B4BFF] text-[#5B4BFF] dark:text-[#9D94FF]"
              >
                Switch to {user.role === 'learner' ? 'Tutor' : 'Learner'}
              </button>
            </div>

            <label className="flex items-start justify-between gap-4 p-4 rounded-xl border border-[#E6E4DF] dark:border-[#272B38] cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-[#141413] dark:text-slate-100">
                  Show college affiliation publicly
                </p>
                <p className="text-xs text-[#5F5D57] dark:text-slate-400 mt-0.5">
                  Helps peers confirm syllabus compatibility before messaging.
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacyPrefs.showCollegePublicly}
                onChange={(e) =>
                  setPrivacyPrefs((prev) => ({
                    ...prev,
                    showCollegePublicly: e.target.checked,
                  }))
                }
                className="mt-1 w-4 h-4 accent-[#5B4BFF]"
              />
            </label>

            <label className="flex items-start justify-between gap-4 p-4 rounded-xl border border-[#E6E4DF] dark:border-[#272B38] cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-[#141413] dark:text-slate-100">
                  Allow cross-college session requests
                </p>
                <p className="text-xs text-[#5F5D57] dark:text-slate-400 mt-0.5">
                  Receive online tutoring requests from verified students at other campuses.
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacyPrefs.allowCrossCollegeRequests}
                onChange={(e) =>
                  setPrivacyPrefs((prev) => ({
                    ...prev,
                    allowCrossCollegeRequests: e.target.checked,
                  }))
                }
                className="mt-1 w-4 h-4 accent-[#5B4BFF]"
              />
            </label>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => updateUserProfile({ privacyPrefs })}
                className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-[#5B4BFF] text-white"
              >
                Save Privacy Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
