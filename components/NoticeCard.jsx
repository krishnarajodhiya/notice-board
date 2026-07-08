import { useState } from 'react';
import Link from 'next/link';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const CATEGORY_STYLES = {
  Exam: 'bg-blue-100 text-blue-800 border-blue-200',
  Event: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  General: 'bg-slate-100 text-slate-700 border-slate-200',
};

const CATEGORY_ICONS = {
  Exam: '📝',
  Event: '🎉',
  General: '📌',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function NoticeCard({ notice, onDeleted }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isUrgent = notice.priority === 'Urgent';

  async function handleConfirmDelete() {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/notices/${notice.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setShowDeleteModal(false);
      onDeleted(notice.id);
    } catch {
      alert('Failed to delete notice. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <article
        className={`relative flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border ${
          isUrgent ? 'border-red-200 ring-1 ring-red-300' : 'border-slate-100'
        } group`}
      >
        {/* Urgent top stripe */}
        {isUrgent && (
          <div className="h-1 w-full bg-gradient-to-r from-red-500 to-rose-400" />
        )}

        {/* Image */}
        {notice.image && (
          <div className="w-full h-44 overflow-hidden bg-slate-100">
            <img
              src={notice.image}
              alt={notice.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            {isUrgent && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300 animate-pulse">
                🚨 URGENT
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${CATEGORY_STYLES[notice.category]}`}
            >
              {CATEGORY_ICONS[notice.category]} {notice.category}
            </span>
            <span className="ml-auto text-xs text-slate-400 font-medium">
              📅 {formatDate(notice.publishDate)}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-slate-800 leading-snug line-clamp-2">
            {notice.title}
          </h2>

          {/* Body */}
          <p className="text-sm text-slate-600 leading-relaxed flex-1 line-clamp-4 whitespace-pre-line">
            {notice.body}
          </p>

          {/* Divider */}
          <hr className="border-slate-100" />

          {/* Footer actions */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              Added {formatDate(notice.createdAt)}
            </span>
            <div className="flex gap-2">
              <Link
                href={`/notices/${notice.id}/edit`}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors duration-150"
              >
                ✏️ Edit
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors duration-150"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </article>

      {showDeleteModal && (
        <ConfirmDeleteModal
          title={notice.title}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}
