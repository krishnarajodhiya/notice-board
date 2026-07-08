import Head from 'next/head';
import Link from 'next/link';
import { prisma } from '../../../lib/prisma';
import NoticeForm from '../../../components/NoticeForm';

export default function EditNotice({ notice }) {
  return (
    <>
      <Head>
        <title>Edit Notice — Notice Board</title>
        <meta name="description" content="Edit an existing notice on the notice board." />
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
              <span className="text-2xl">✏️</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Edit Notice
              </h1>
            </div>
            <p className="mt-1 text-indigo-200 text-sm line-clamp-1">
              Editing: <span className="font-semibold text-white">{notice.title}</span>
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
            <NoticeForm initialData={notice} />
          </div>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return { notFound: true };

  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) return { notFound: true };

  return {
    props: {
      notice: {
        ...notice,
        publishDate: notice.publishDate.toISOString(),
        createdAt: notice.createdAt.toISOString(),
        updatedAt: notice.updatedAt.toISOString(),
      },
    },
  };
}
