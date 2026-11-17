import React, { useState } from 'react';
import { Calendar, FileText, Paperclip, Send, Video } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/ui/Avatar';

export function MessagesPage() {
  const {
    threads,
    activeThreadId,
    setActiveThreadId,
    sendMessage,
    openSessionRoom,
  } = useApp();

  const [draft, setDraft] = useState('');
  const [attachmentName, setAttachmentName] = useState<string | undefined>();
  const [typingSim, setTypingSim] = useState(false);

  const activeThread = threads.find((th) => th.id === activeThreadId) || threads[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() && !attachmentName) return;
    sendMessage(activeThread.id, draft.trim() || 'Shared a study file.', attachmentName);
    setDraft('');
    setAttachmentName(undefined);
    setTypingSim(true);
    window.setTimeout(() => setTypingSim(false), 1600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#141413] dark:text-white">
          Messages
        </h1>
        <p className="mt-1 text-sm text-[#5F5D57] dark:text-slate-400">
          Coordinate topics, share syllabus PDFs, and confirm meetup spots.
        </p>
      </div>

      <div className="bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
        {/* Left Thread List */}
        <aside className="md:col-span-4 border-b md:border-b-0 md:border-r border-[#E6E4DF] dark:border-[#272B38] divide-y divide-[#E6E4DF] dark:divide-[#272B38]">
          {threads.map((thread) => {
            const selected = thread.id === activeThread.id;
            const lastMsg = thread.messages[thread.messages.length - 1];
            return (
              <button
                key={thread.id}
                type="button"
                onClick={() => setActiveThreadId(thread.id)}
                className={`w-full text-left p-4 flex items-start gap-3 transition-colors ${
                  selected
                    ? 'bg-[#5B4BFF]/[0.06] dark:bg-[#5B4BFF]/15'
                    : 'hover:bg-stone-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <Avatar
                  src={thread.participantAvatar}
                  alt={thread.participantName}
                  initials={thread.participantInitials}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#141413] dark:text-white truncate">
                      {thread.participantName}
                    </p>
                    <span className="text-[11px] text-[#5F5D57] dark:text-slate-400 shrink-0">
                      {lastMsg?.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#5F5D57] dark:text-slate-400 truncate">
                    {thread.participantCollege} · {thread.participantRole}
                  </p>
                  <p className="mt-1 text-xs text-[#3E3D38] dark:text-slate-300 truncate">
                    {lastMsg?.text}
                  </p>
                </div>
                {thread.unreadCount > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#5B4BFF] text-white text-[10px] font-mono font-semibold flex items-center justify-center tabular-nums">
                    {thread.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Right Conversation View */}
        <section className="md:col-span-8 flex flex-col justify-between">
          <div>
            {/* Chat Header */}
            <div className="px-5 py-4 border-b border-[#E6E4DF] dark:border-[#272B38] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar
                  src={activeThread.participantAvatar}
                  alt={activeThread.participantName}
                  initials={activeThread.participantInitials}
                  size="sm"
                />
                <div>
                  <h2 className="text-sm font-display font-semibold text-[#141413] dark:text-white">
                    {activeThread.participantName}
                  </h2>
                  <p className="text-xs text-[#5F5D57] dark:text-slate-400">
                    {activeThread.participantCollege}
                  </p>
                </div>
              </div>

              {activeThread.sessionContext && (
                <button
                  type="button"
                  onClick={() => openSessionRoom(activeThread.sessionContext!.bookingId)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#5B4BFF] text-white hover:bg-[#4A3AE8]"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Open Session Room</span>
                </button>
              )}
            </div>

            {/* Session Context Card Inside Chat */}
            {activeThread.sessionContext && (
              <div className="mx-5 mt-4 p-3.5 rounded-xl bg-stone-50 dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#5B4BFF]" />
                  <div>
                    <p className="font-semibold text-[#141413] dark:text-slate-100">
                      {activeThread.sessionContext.subject}
                    </p>
                    <p className="text-[#5F5D57] dark:text-slate-400">
                      {activeThread.sessionContext.date} at {activeThread.sessionContext.timeSlot} ·{' '}
                      {activeThread.sessionContext.mode} · Status: {activeThread.sessionContext.status}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Messages Feed */}
            <div className="p-5 space-y-4 max-h-[360px] overflow-y-auto">
              {activeThread.messages.map((msg) => {
                const isMe = msg.sender === 'me';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? 'bg-[#5B4BFF] text-white'
                          : 'bg-stone-100 dark:bg-[#1E222E] text-[#141413] dark:text-slate-100'
                      }`}
                    >
                      <p>{msg.text}</p>
                      {msg.attachmentName && (
                        <div
                          className={`mt-2 px-3 py-1.5 rounded-xl text-xs inline-flex items-center gap-2 ${
                            isMe
                              ? 'bg-white/15 text-white'
                              : 'bg-white dark:bg-[#171A23] border border-[#E6E4DF] dark:border-[#272B38]'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{msg.attachmentName}</span>
                        </div>
                      )}
                    </div>
                    <span className="mt-1 text-[11px] text-[#5F5D57] dark:text-slate-500">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {typingSim && (
                <p className="text-xs text-[#5F5D57] dark:text-slate-400 italic">
                  {activeThread.participantName.split(' ')[0]} is typing…
                </p>
              )}
            </div>
          </div>

          {/* Composer */}
          <form
            onSubmit={handleSend}
            className="p-4 border-t border-[#E6E4DF] dark:border-[#272B38] space-y-2"
          >
            {attachmentName && (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-[#1E222E] text-xs">
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#5B4BFF]" />
                  {attachmentName}
                </span>
                <button
                  type="button"
                  onClick={() => setAttachmentName(undefined)}
                  className="text-[#5F5D57] hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAttachmentName('Problem_Set_4_Questions.pdf')}
                title="Attach problem set PDF"
                aria-label="Attach study file"
                className="p-2.5 rounded-xl border border-[#E6E4DF] dark:border-[#272B38] text-[#5F5D57] dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Message ${activeThread.participantName.split(' ')[0]}...`}
                className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-stone-50 dark:bg-[#1E222E] border border-[#E6E4DF] dark:border-[#272B38] text-[#141413] dark:text-slate-100"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="px-4 py-2.5 rounded-xl bg-[#5B4BFF] text-white hover:bg-[#4A3AE8] inline-flex items-center gap-1.5 text-sm font-medium"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
