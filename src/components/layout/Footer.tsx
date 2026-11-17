import React from 'react';
import { Github, Globe, Instagram, Linkedin, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Footer() {
  const { navigate, openAuth } = useApp();

  return (
    <footer className="border-t border-[#E6E4DF] dark:border-[#272B38] bg-white dark:bg-[#13161E] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => navigate('landing')}
              className="text-lg font-display font-bold tracking-tight text-[#141413] dark:text-white"
            >
              Peer<span className="text-[#5B4BFF]">Learn</span>
            </button>
            <p className="text-sm text-[#5F5D57] dark:text-slate-400 leading-relaxed max-w-xs">
              Verified student-to-student tutoring across college campuses. Honest rates, real peers, zero textbook fluff.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="#social-instagram"
                onClick={(e) => e.preventDefault()}
                aria-label="PeerLearn on Instagram"
                className="p-2 rounded-lg text-[#5F5D57] dark:text-slate-400 hover:text-[#5B4BFF] hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#social-linkedin"
                onClick={(e) => e.preventDefault()}
                aria-label="PeerLearn on LinkedIn"
                className="p-2 rounded-lg text-[#5F5D57] dark:text-slate-400 hover:text-[#5B4BFF] hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#social-github"
                onClick={(e) => e.preventDefault()}
                aria-label="PeerLearn on GitHub"
                className="p-2 rounded-lg text-[#5F5D57] dark:text-slate-400 hover:text-[#5B4BFF] hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#social-mail"
                onClick={(e) => e.preventDefault()}
                aria-label="Contact PeerLearn"
                className="p-2 rounded-lg text-[#5F5D57] dark:text-slate-400 hover:text-[#5B4BFF] hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-display font-semibold text-[#141413] dark:text-slate-100 mb-3">
              Marketplace
            </h3>
            <ul className="space-y-2.5 text-sm text-[#5F5D57] dark:text-slate-400">
              <li>
                <button type="button" onClick={() => navigate('find-tutors')} className="hover:text-[#141413] dark:hover:text-white">
                  Browse Tutors
                </button>
              </li>
              <li>
                <button type="button" onClick={() => openAuth('signup', 'tutor')} className="hover:text-[#141413] dark:hover:text-white">
                  Become a Tutor
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('session')} className="hover:text-[#141413] dark:hover:text-white">
                  Live Study Room
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('messages')} className="hover:text-[#141413] dark:hover:text-white">
                  Peer Messaging
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-display font-semibold text-[#141413] dark:text-slate-100 mb-3">
              Workspaces
            </h3>
            <ul className="space-y-2.5 text-sm text-[#5F5D57] dark:text-slate-400">
              <li>
                <button type="button" onClick={() => navigate('learner-dashboard')} className="hover:text-[#141413] dark:hover:text-white">
                  Learner Dashboard
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('tutor-dashboard')} className="hover:text-[#141413] dark:hover:text-white">
                  Tutor Dashboard
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('admin')} className="hover:text-[#141413] dark:hover:text-white">
                  Verification Queue
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('settings')} className="hover:text-[#141413] dark:hover:text-white">
                  Account Settings
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-display font-semibold text-[#141413] dark:text-slate-100 mb-3">
              Trust & Campus Safety
            </h3>
            <ul className="space-y-2.5 text-sm text-[#5F5D57] dark:text-slate-400">
              <li>College email (.edu / .ac) required</li>
              <li>Student ID verification before payout</li>
              <li>Public library & commons meetup spots</li>
              <li className="inline-flex items-center gap-1.5 pt-1 text-xs">
                <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                <span>48+ campuses connected</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#E6E4DF] dark:border-[#272B38] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5F5D57] dark:text-slate-500">
          <p>© 2026 PeerLearn. Built for university students.</p>
          <div className="flex items-center gap-6">
            <button type="button" onClick={() => navigate('settings')} className="hover:text-[#141413] dark:hover:text-slate-300">
              Privacy Policy
            </button>
            <button type="button" onClick={() => navigate('404')} className="hover:text-[#141413] dark:hover:text-slate-300">
              Help & Status
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
