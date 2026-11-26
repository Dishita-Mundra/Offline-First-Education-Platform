# Indo American School – Smart Learning Platform

**Tagline:** *Empowering Young Minds, Building Bright Futures.*

Indo American School Smart Learning Platform is a full-stack, Offline-First Progressive Web Application (PWA) built for **CBSE Classes 1 to 10** students, faculty, and administrators. Students can cache chapter packages locally in IndexedDB, practice interactive concept visualizers, attempt timed quizzes offline, and automatically synchronize progress when connectivity returns.

---

## Architecture & Technology Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, React Router, Lucide Icons
- **Backend Server:** Node.js + Express (`server.ts`, `server/db.ts`, `server/adminAuth.ts`) serving REST APIs, Admin bcrypt/JWT authentication, Teacher approval workflows, local dev file uploads (`/uploads`), Gemini AI Doubt Assistant (`/api/ai/doubt`), and Vite / static production assets on port `3000`
- **Databases & Auth:**
  - **MongoDB (Mongoose ODM):** Stores Admin accounts (`bcrypt`-hashed passwords), Teacher registration & approval status, Invite codes, Announcements, Contact inquiries, and fallback Teacher content when `MONGODB_URI` is configured (with automatic local server persistence in `data/ias-db.json` when `MONGODB_URI` is not yet set)
  - **Firebase Auth & Cloud Firestore:** Verified Google Sign-In for Students and Teachers + offline-synced study data (`firestore.rules`)
- **Offline & PWA:** IndexedDB (`idb` in `src/offline/offlineDb.ts`), Idempotent Sync Queue (`src/offline/syncEngine.ts`), Service Worker & Web App Manifest (`vite-plugin-pwa`)
- **Centralized Image & Brand Config:** `src/config/schoolImages.ts` & `src/assets/images/`

---

## Core Features

### 1. CBSE Curriculum (Classes 1 to 10)
- **Primary (Classes 1–5):** English, Hindi, Mathematics, Environmental Studies (EVS), Computer Studies
- **Middle (Classes 6–8):** English, Hindi, Mathematics, Science, Social Science, Sanskrit, Computer Studies
- **Secondary (Classes 9–10):** English, Hindi, Mathematics, Science, Social Science, Information Technology
- Each subject includes 3 structured chapters with learning objectives, detailed study notes, bilingual Hindi summaries, quick revision points, practice Q&A, interactive concept visualizers, printable HTML study sheets, and 5-question MCQ quizzes with explanations.

### 2. Offline-First Sync Engine (`src/offline/`)
- **Downloadable Packages:** Students can download individual chapters or entire subjects into IndexedDB (`ias_offline_v1`).
- **Offline Quizzes & Digital Notebook:** Timed quizzes, lesson completions, bookmarks, and personal study notes work offline and write to a local `syncQueue`.
- **Idempotent Cloud Sync:** When the browser regains connectivity (`online` event) or via manual **Sync**, queued operations sync deterministically without duplicating quiz attempts.

### 3. Role-Based Portals & Teacher Approval Workflow
- **Student Portal (`/student`):** Overview KPIs, My Learning Explorer, Smart Quiz Runner, Assignments & File Submission, Subject Progress & Weak Topic Planner, Offline Digital Notebook, Gemini AI Doubt Solver, Doubt Discussion Forum, Badges, Class Leaderboard, Certificates, and Shareable Parent Progress Reports (`/parent-report/:reportId`).
- **Faculty Studio (`/teacher`):** Admin-approved educator workspace for creating & publishing CBSE courses/lessons, building timed MCQ quizzes, creating & grading assignments, exporting CSV student performance reports, and answering doubts. Newly registered teachers without an invite code are placed in `pending` status until an Admin approves them.
- **Admin Control (`/admin` & `/admin-login`):** Protected Administrator Portal with **Teacher Approval Management** (Approve / Reject pending teachers), Teacher Invitation Code generator, User Directory, Course & Discussion moderation, Broadcast Announcements, and Contact Form Inbox.

---

## Setting Up the First Admin Account

You can initialize the Administrator account using **either** server environment variables (recommended for production/MongoDB) **or** the built-in First-Run Admin Setup screen:

### Option A: Using Environment Variables (Recommended)
1. Configure your server environment (`.env` locally or your host Secrets panel — never commit `.env` and never prefix these with `VITE_`):
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/indo_american_school
   ADMIN_EMAIL=principal@indoamericanschool.edu
   ADMIN_PASSWORD=YourStrongAdminPassword123!
   ```
2. Start or restart the server (`npm run dev`). On startup, the server connects to MongoDB, hashes `ADMIN_PASSWORD` with `bcrypt` (cost factor 12), and securely seeds the Admin account. Plaintext passwords are never stored in the database or exposed to the frontend.
3. Open **`/login`** (or **`/admin-login`**), select the **Admin Login** tab, and sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

### Option B: First-Run Admin Setup UI (When `ADMIN_EMAIL` / `ADMIN_PASSWORD` Are Not Pre-Set)
1. Start the server without `ADMIN_EMAIL` / `ADMIN_PASSWORD` configured.
2. Navigate to **`/login`** and click **Admin Login** (or visit **`/admin-login`** directly).
3. Complete the **Initialize First Admin Account** form (Full Name, Admin Email, Password min 8 characters).
4. Once submitted, the server hashes the password with `bcrypt`, saves the Admin record, locks the one-time setup endpoint permanently, and opens the protected **`/admin`** dashboard.

---

## Replacing School Logo & Images

All visual assets are managed in one place at `src/config/schoolImages.ts` and `src/assets/images/`:
- Set `SCHOOL_IMAGES.logo.customLogoSrc` to replace the default Navy & Gold crest with your official school logo file.
- Update `heroCampus`, `campusAbout`, `scienceLab`, `mathAcademy`, `studentSpotlight`, and `teacherSpotlight` paths in `src/config/schoolImages.ts` to swap campus and classroom photos effortlessly.

---

## API Endpoints (`server.ts`)

- `GET /api/health` — Server status & storage mode check
- `GET /api/admin/status` — Checks whether an Admin account is configured or first-run setup is needed
- `POST /api/admin/bootstrap` — One-time first-run Admin creation (locked once an Admin exists or env vars are set)
- `POST /api/admin/login` — Authenticates Admin email + bcrypt password and returns an 8h signed JWT
- `GET /api/admin/me` — Returns authenticated Admin profile (`Authorization: Bearer <token>`)
- `GET /api/admin/teachers` — Lists pending, approved, and rejected teachers (Admin-only)
- `PATCH /api/admin/teachers/:uid/status` — Approves or rejects a teacher registration (Admin-only)
- `GET / POST / DELETE /api/admin/invites` — Manages teacher invitation codes (Admin-only)
- `POST /api/teachers/sync` & `GET /api/teachers/status` — Syncs and checks verified Firebase teacher registration status
- `GET /api/classes` — Summary of CBSE Classes 1–10
- `GET /api/classes/:classNum/subjects` — Subjects for a given CBSE class
- `GET /api/subjects/:subjectId/chapters` — Chapters for a subject
- `GET /api/search?q=...&class=...` — Full curriculum search
- `GET /api/ai/status` & `POST /api/ai/doubt` — Gemini AI Doubt Assistant via `@google/genai`
- `POST /api/upload` — Saves worksheet/resource files locally in `uploads/` for development

---

## Local Development

1. Install dependencies: `npm install`
2. Run development server: `npm run dev` (starts Express + Vite on `http://localhost:3000`)
3. Type-check: `npm run lint`
4. Production build: `npm run build`

