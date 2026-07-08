# Notice Board

A full-stack **Notice Board** web application with CRUD operations, built with **Next.js Pages Router**, **Prisma ORM**, **Neon PostgreSQL**, and **Tailwind CSS**. Deployed on **Vercel**.

🔗 **Live demo**: _[Add your Vercel URL here after deployment]_

---

## Features

- **Create, Read, Update, Delete** notices via a clean, responsive UI
- **Urgent notices appear above Normal notices** — sorted server-side via Prisma `orderBy`
- **Red "Urgent" badge** on urgent notices with a pulsing animation
- **Category badges** with color-coding (Exam / Event / General)
- **Delete confirmation modal** — no silent deletes
- **Image upload** to Cloudinary OR paste a URL (bonus feature)
- **Server-side validation** on all API routes — rejects empty fields and invalid dates with `400` responses
- **Responsive design** — works on phone and desktop
- **SSR** via `getServerSideProps` — data is always fresh, ordered correctly on first load

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16, **Pages Router** (`pages/`) |
| ORM | Prisma 7 with `@prisma/adapter-pg` driver adapter |
| Database | **Neon** (free, hosted PostgreSQL) |
| Styling | **Tailwind CSS** v4 + Inter font |
| Image hosting | **Cloudinary** (free tier) |
| Deployment | **Vercel** (Hobby tier, free) |

---

## Project Structure

```
notice-board/
├── prisma/
│   ├── schema.prisma         # Notice model + Category/Priority enums
│   └── migrations/           # Migration history
├── pages/
│   ├── index.js              # List page (SSR, Urgent-first ordering)
│   ├── notices/
│   │   ├── new.js            # Create notice form
│   │   └── [id]/edit.js      # Edit notice (pre-filled)
│   └── api/
│       ├── notices/
│       │   ├── index.js      # GET (list), POST (create)
│       │   └── [id].js       # GET, PUT, DELETE
│       └── upload.js         # Cloudinary image upload
├── components/
│   ├── NoticeCard.jsx         # Card with Edit/Delete actions
│   ├── NoticeForm.jsx         # Shared create/edit form
│   └── ConfirmDeleteModal.jsx # Confirmation modal
├── lib/
│   └── prisma.js             # Prisma singleton with PrismaPg adapter
├── styles/
│   └── globals.css
├── .env.example              # Environment variable template
├── prisma.config.example.ts  # Prisma config template
└── README.md
```

---

## Running Locally

### 1. Prerequisites

- Node.js 18+ and npm
- A free [Neon](https://neon.tech) PostgreSQL database
- A free [Cloudinary](https://cloudinary.com) account (for image uploads)

### 2. Clone & install

```bash
git clone https://github.com/your-username/notice-board.git
cd notice-board
npm install
```

### 3. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Set up Prisma config

Copy the example and add your DATABASE_URL:

```bash
cp prisma.config.example.ts prisma.config.ts
# Edit prisma.config.ts and set the url field
```

### 5. Run migrations & generate client

```bash
npx prisma migrate dev
npx prisma generate
```

### 6. Start dev server

```bash
npm run dev
```

Visit `http://localhost:3000`.

---

## API Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/notices` | List all notices (Urgent first, then newest `publishDate`) |
| `POST` | `/api/notices` | Create a notice (server-side validated) |
| `GET` | `/api/notices/:id` | Get single notice |
| `PUT` | `/api/notices/:id` | Update notice (server-side validated) |
| `DELETE` | `/api/notices/:id` | Delete notice |
| `POST` | `/api/upload` | Upload image to Cloudinary |

**Validation** (runs on server only):
- `title`, `body`, `category`, `priority`, `publishDate` are all required
- `publishDate` must parse as a valid date
- Invalid requests return `400` with a JSON `{ errors: [...] }` body

---

## Ordering Rule (Urgent-first)

Notices are ordered via Prisma's `orderBy`:

```js
orderBy: [
  { priority: 'desc' }, // 'Urgent' > 'Normal' alphabetically in DESC order
  { publishDate: 'desc' }, // newest first within each priority group
]
```

This runs **server-side in the database query** — no client-side sorting.

---

## Deploying to Vercel

1. Push this repo to a **public GitHub repository**
2. Connect the repo to [Vercel](https://vercel.com)
3. Set these environment variables in Vercel → Settings → Environment Variables:
   - `DATABASE_URL`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Add a build command override in Vercel: `npx prisma generate && next build`
5. Deploy!

---

## What I'd Improve with More Time

**Rich-text body editor**: Replace the plain `<textarea>` for the notice body with a rich-text editor (e.g., TipTap or Quill), so notices can include formatted text, bullet lists, and highlighted sections — making them much more readable on the board.

Other improvements I'd consider:
- **Pagination or infinite scroll** on the list page as notice count grows
- **Search and filter** by category, priority, or date range
- **Authentication** so only admins can post/edit/delete notices
- **Email/push notifications** when a new Urgent notice is posted

---

## AI Usage Disclosure

This project was built with the assistance of **Antigravity (Google DeepMind)**, an AI coding assistant. Specifically:

- **Architecture planning**: AI drafted the initial project structure, file layout, and implementation plan based on the spec
- **Boilerplate generation**: API route scaffolding, Prisma schema, and component structure were generated by AI and then reviewed
- **Debugging**: AI helped diagnose and fix Prisma 7 breaking changes (driver adapter requirement, `prisma.config.ts` format) that weren't well-documented
- **README**: Drafted by AI, reviewed and edited for accuracy

All generated code was reviewed line-by-line to ensure correctness, security, and alignment with the spec requirements.
