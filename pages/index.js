import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { prisma } from '../lib/prisma';
import NoticeCard from '../components/NoticeCard';

export default function Home({ initialNotices }) {
  const [notices, setNotices] = useState(initialNotices);

  function handleDeleted(deletedId) {
    setNotices((prev) => prev.filter((n) => n.id !== deletedId));
  }

  return (
    <>
      <Head>
        <title>Notice Board — Stay Informed</title>
        <meta name="description" content="View all institution notices including exams, events, and general announcements." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-slate-50">
        {/* Hero Header */}
        <header className="bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-900 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">📋</span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Notice Board
                  </h1>
                </div>
                <p className="text-indigo-200 text-sm sm:text-base max-w-md">
                  Stay up-to-date with the latest announcements, exams, and events from your institution.
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-300">
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
                    {notices.length} {notices.length === 1 ? 'Notice' : 'Notices'} posted
                  </span>
                  {notices.filter(n => n.priority === 'Urgent').length > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-300">
                      🚨 {notices.filter(n => n.priority === 'Urgent').length} Urgent
                    </span>
                  )}
                </div>
              </div>
              <Link
                href="/notices/new"
                className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-indigo-900 bg-white hover:bg-indigo-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap"
              >
                + Add Notice
              </Link>
            </div>
          </div>

          {/* Wave divider */}
          <div className="overflow-hidden leading-none">
            <svg viewBox="0 0 1440 40" xmlns="http://www.w3.org/2000/svg" className="w-full h-10 fill-slate-50">
              <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" />
            </svg>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {notices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-6xl mb-4">📭</span>
              <h2 className="text-xl font-bold text-slate-700 mb-2">No notices yet</h2>
              <p className="text-slate-400 text-sm mb-6">Be the first to post an announcement!</p>
              <Link
                href="/notices/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md"
              >
                + Add First Notice
              </Link>
            </div>
          ) : (
            <>
              {/* Urgent section */}
              {notices.some((n) => n.priority === 'Urgent') && (
                <section className="mb-8" aria-label="Urgent notices">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">🚨</span>
                    <h2 className="text-base font-bold text-red-700 uppercase tracking-wide">Urgent</h2>
                    <div className="flex-1 h-px bg-red-200" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {notices
                      .filter((n) => n.priority === 'Urgent')
                      .map((notice) => (
                        <NoticeCard key={notice.id} notice={notice} onDeleted={handleDeleted} />
                      ))}
                  </div>
                </section>
              )}

              {/* Normal section */}
              {notices.some((n) => n.priority === 'Normal') && (
                <section aria-label="General notices">
                  {notices.some((n) => n.priority === 'Urgent') && (
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">📌</span>
                      <h2 className="text-base font-bold text-slate-500 uppercase tracking-wide">General</h2>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {notices
                      .filter((n) => n.priority === 'Normal')
                      .map((notice) => (
                        <NoticeCard key={notice.id} notice={notice} onDeleted={handleDeleted} />
                      ))}
                  </div>
                </section>
              )}
            </>
          )}
        </main>

        <footer className="mt-12 pb-8 text-center text-xs text-slate-400">
          Notice Board &copy; {new Date().getFullYear()} — Powered by Next.js &amp; Prisma
        </footer>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const notices = await prisma.notice.findMany({
    orderBy: [
      { priority: 'desc' }, // 'Urgent' > 'Normal' alphabetically in DESC
      { publishDate: 'desc' },
    ],
  });

  // Serialize dates
  const serialized = notices.map((n) => ({
    ...n,
    publishDate: n.publishDate.toISOString(),
    createdAt: n.createdAt.toISOString(),
    updatedAt: n.updatedAt.toISOString(),
  }));

  return { props: { initialNotices: serialized } };
}
