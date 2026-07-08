export default function ConfirmDeleteModal({ title, isDeleting, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4 animate-modal-in">
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto">
          <span className="text-2xl">🗑️</span>
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 id="delete-modal-title" className="text-xl font-bold text-slate-800">
            Delete Notice?
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Are you sure you want to permanently delete{' '}
            <span className="font-semibold text-slate-700">&ldquo;{title}&rdquo;</span>?
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-150 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors duration-150 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Deleting…
              </>
            ) : (
              'Yes, Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
