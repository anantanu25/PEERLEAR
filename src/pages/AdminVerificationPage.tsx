import React, { useState } from 'react';
import { Check, ShieldCheck, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubjectChip } from '../components/ui/SubjectChip';

export function AdminVerificationPage() {
  const { verificationQueue, handleVerificationDecision } = useApp();
  const [selectedId, setSelectedId] = useState(verificationQueue[0]?.id || '');
  const [rejectNote, setRejectNote] = useState('');

  const selected =
    verificationQueue.find((v) => v.id === selectedId) || verificationQueue[0];

  const pendingCount = verificationQueue.filter((v) => v.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#141413] dark:text-white">
            Tutor Verification Queue
          </h1>
          <p className="mt-1 text-sm text-[#5F5D57] dark:text-slate-400 tabular-nums">
            {pendingCount} pending student ID reviews · Verify .edu/.ac domain & photo match
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Queue List */}
        <div className="lg:col-span-5 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl divide-y divide-[#E6E4DF] dark:divide-[#272B38]">
          {verificationQueue.map((item) => {
            const active = selected?.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`w-full text-left p-4 transition-colors ${
                  active
                    ? 'bg-[#5B4BFF]/[0.06] dark:bg-[#5B4BFF]/15'
                    : 'hover:bg-stone-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#141413] dark:text-white">
                    {item.name}
                  </p>
                  <span
                    className={`text-xs font-semibold capitalize ${
                      item.status === 'approved'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : item.status === 'rejected'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-[#5F5D57] dark:text-slate-400 mt-0.5">
                  {item.college} · {item.course}
                </p>
                <p className="text-[11px] text-[#5F5D57] dark:text-slate-500 mt-1">
                  Submitted {item.submittedAt}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Detail & ID Preview */}
        {selected && (
          <div className="lg:col-span-7 bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-display font-bold text-[#141413] dark:text-white">
                    {selected.name}
                  </h2>
                  <ShieldCheck className="w-5 h-5 text-[#5B4BFF]" />
                </div>
                <p className="text-sm text-[#5F5D57] dark:text-slate-400 mt-0.5">
                  {selected.email} · {selected.college}
                </p>
                <p className="text-xs text-[#5F5D57] dark:text-slate-400">
                  {selected.course} · {selected.yearOfStudy}
                </p>
              </div>
              <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1E222E] text-[#141413] dark:text-slate-200">
                {selected.status}
              </span>
            </div>

            <div>
              <p className="text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-2">
                Requested tutoring subjects
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selected.subjects.map((subj) => (
                  <SubjectChip key={subj} label={subj} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-2">
                Submitted College ID Preview
              </p>
              <div className="rounded-xl overflow-hidden border border-[#E6E4DF] dark:border-[#272B38] bg-stone-100 dark:bg-[#1E222E] max-h-72">
                <img
                  src={selected.idImageUrl}
                  alt={`Student ID card for ${selected.name}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5F5D57] dark:text-slate-400 mb-1.5">
                Reviewer note (optional for approval, recommended if rejecting)
              </label>
              <input
                type="text"
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="e.g. ID expiration date confirmed through 2027"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-[#E6E4DF] dark:border-[#272B38]">
              <button
                type="button"
                onClick={() => {
                  handleVerificationDecision(
                    selected.id,
                    'rejected',
                    rejectNote.trim() || 'Blurry ID photo — please re-upload.'
                  );
                  setRejectNote('');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl border border-red-300 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <X className="w-4 h-4" />
                <span>Reject Application</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleVerificationDecision(selected.id, 'approved', rejectNote.trim());
                  setRejectNote('');
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Check className="w-4 h-4" />
                <span>Approve & Verify Tutor</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
