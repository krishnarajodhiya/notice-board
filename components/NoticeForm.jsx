import { useState, useRef } from 'react';
import { useRouter } from 'next/router';

const CATEGORIES = ['Exam', 'Event', 'General'];

function toDateInputValue(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

export default function NoticeForm({ initialData }) {
  const router = useRouter();
  const isEditing = !!initialData;
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: initialData?.title || '',
    body: initialData?.body || '',
    category: initialData?.category || 'General',
    priority: initialData?.priority || 'Normal',
    publishDate: toDateInputValue(initialData?.publishDate),
    image: initialData?.image || '',
  });

  const [imagePreview, setImagePreview] = useState(initialData?.image || '');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleImageFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrors([]);

    try {
      const data = new FormData();
      data.append('image', file);
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || 'Upload failed');

      setForm((prev) => ({ ...prev, image: json.url }));
      setImagePreview(json.url);
    } catch (err) {
      setErrors([err.message]);
    } finally {
      setUploadingImage(false);
    }
  }

  function handleImageUrlChange(e) {
    const url = e.target.value;
    setForm((prev) => ({ ...prev, image: url }));
    setImagePreview(url);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);

    const url = isEditing ? `/api/notices/${initialData.id}` : '/api/notices';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || [data.error] || ['Something went wrong.']);
        return;
      }

      router.push('/');
    } catch {
      setErrors(['Network error. Please try again.']);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Server errors */}
      {errors.length > 0 && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4" role="alert">
          <p className="text-sm font-semibold text-red-700 mb-1">Please fix the following errors:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {errors.map((e, i) => (
              <li key={i} className="text-sm text-red-600">{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Title */}
      <div className="space-y-1.5">
        <label htmlFor="title" className="block text-sm font-semibold text-slate-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Mid-term Exam Schedule"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-sm"
          required
        />
      </div>

      {/* Body */}
      <div className="space-y-1.5">
        <label htmlFor="body" className="block text-sm font-semibold text-slate-700">
          Body <span className="text-red-500">*</span>
        </label>
        <textarea
          id="body"
          name="body"
          value={form.body}
          onChange={handleChange}
          rows={5}
          placeholder="Provide detailed information about the notice…"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-sm resize-none"
          required
        />
      </div>

      {/* Category + Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Category */}
        <div className="space-y-1.5">
          <label htmlFor="category" className="block text-sm font-semibold text-slate-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-sm appearance-none cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Publish Date */}
        <div className="space-y-1.5">
          <label htmlFor="publishDate" className="block text-sm font-semibold text-slate-700">
            Publish Date <span className="text-red-500">*</span>
          </label>
          <input
            id="publishDate"
            name="publishDate"
            type="date"
            value={form.publishDate}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-sm cursor-pointer"
            required
          />
        </div>
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <span className="block text-sm font-semibold text-slate-700">
          Priority <span className="text-red-500">*</span>
        </span>
        <div className="flex gap-4">
          {['Normal', 'Urgent'].map((p) => (
            <label
              key={p}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                form.priority === p
                  ? p === 'Urgent'
                    ? 'border-red-400 bg-red-50 text-red-700'
                    : 'border-indigo-400 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="priority"
                value={p}
                checked={form.priority === p}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="text-base">{p === 'Urgent' ? '🚨' : '✅'}</span>
              <span className="text-sm font-semibold">{p}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Image upload */}
      <div className="space-y-3">
        <span className="block text-sm font-semibold text-slate-700">
          Image <span className="text-slate-400 font-normal">(optional)</span>
        </span>

        {/* File upload button */}
        <div className="flex gap-3 items-center flex-wrap">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors disabled:opacity-50"
          >
            {uploadingImage ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Uploading…
              </>
            ) : (
              <>📁 Upload Image</>
            )}
          </button>
          <span className="text-xs text-slate-400">or paste a URL below</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleImageFileChange}
          className="sr-only"
          aria-label="Upload image file"
        />

        <input
          id="image-url"
          name="image"
          type="url"
          value={form.image}
          onChange={handleImageUrlChange}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-sm"
        />

        {/* Preview */}
        {imagePreview && (
          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 h-40">
            <img
              src={imagePreview}
              alt="Image preview"
              className="w-full h-full object-cover"
              onError={() => setImagePreview('')}
            />
            <button
              type="button"
              onClick={() => {
                setForm((prev) => ({ ...prev, image: '' }));
                setImagePreview('');
              }}
              className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-slate-600 rounded-lg border border-slate-200 text-xs shadow-sm"
            >
              ✕ Remove
            </button>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="flex-1 px-4 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-150"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || uploadingImage}
          className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-150 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              {isEditing ? 'Saving…' : 'Creating…'}
            </>
          ) : (
            isEditing ? '💾 Save Changes' : '✨ Create Notice'
          )}
        </button>
      </div>
    </form>
  );
}
