import Head from 'next/head';
import Link from 'next/link';
import NoticeForm from '../../components/NoticeForm';

export default function NewNotice() {
  return (
    <>
      <Head>
        <title>Add Notice — Notice Board</title>
        <meta name="description" content="Create a new notice for your institution's notice board." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-900 text-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-indigo-300 hover:text-white text-sm font-medium transition-colors mb-4"
            >
              ← Back to Board
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                New Notice
              </h1>
            </div>
            <p className="mt-1 text-indigo-200 text-sm">
              Fill in the details below to post a new announcement.
            </p>
          </div>
          <div className="overflow-hidden leading-none">
            <svg viewBox="0 0 1440 30" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 fill-slate-50">
              <path d="M0,15 C360,30 1080,0 1440,15 L1440,30 L0,30 Z" />
            </svg>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
            <NoticeForm />
          </div>
        </main>
      </div>
    </>
  );
}
