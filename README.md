# ◇ CRM Platform

> A full-stack enterprise CRM web application — customer management, lead pipeline, task tracking, email logging, and analytics dashboard.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-6DB33F?logo=spring-boot)](https://spring.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk)](https://openjdk.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-green)](#)

**[Live Demo](https://crm-frontend-six-pearl.vercel.app/)** · **[Backend API](https://crm-backend-zsi9.onrender.com/api/)** · **[Portfolio](https://crm-frontend-six-pearl.vercel.app/about)**

---

## Screenshots

> Screenshots can be added here. The app features a Mercedes-Benz-inspired dark UI with gradient accents, animated charts, and a fully responsive layout.

| Dashboard | Lead Pipeline | Contacts |
|-----------|--------------|----------|
| *Analytics, charts, activity feed* | *Kanban drag-and-drop* | *CRUD with search & filters* |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| **Backend** | Spring Boot 3.4, Java 21, Spring Security + JWT |
| **Database** | H2 (dev), PostgreSQL (prod) |
| **State** | TanStack Query with localStorage cache persistence |
| **Forms** | React Hook Form + Zod validation |
| **Charts** | Recharts (Area, Bar, Pie, Funnel) |
| **Drag & Drop** | @dnd-kit (Kanban board) |
| **Animations** | Framer Motion |
| **i18n** | React Context (EN + pt-BR) |
| **Deployment** | Vercel (frontend), Render (backend), Docker |

## Features

### Core CRM
- **Authentication** — Email/password + Google OAuth with JWT tokens
- **User Data Isolation** — Every user sees only their own data
- **Customer Management** — Full CRUD with company associations
- **Lead Pipeline** — 6-stage kanban (New → Won/Lost) with drag-and-drop
- **Company Directory** — Industry tracking and deal aggregation
- **Task Management** — Priorities, due dates, assignment tracking
- **Activity Logging** — Calls, emails, meetings, notes per customer
- **Email Tracking** — Log and track email conversations

### Dashboard & Analytics
- **Stats Cards** — Animated counters with click-through navigation
- **Pipeline Donut Chart** — Lead distribution by status
- **Revenue Trend** — Area chart showing monthly revenue
- **Deal Distribution** — Bar chart by company
- **Conversion Funnel** — Animated stage-by-stage breakdown
- **Activity Feed** — Recent 5 activities with type badges

### UX & Polish
- **Global Search** — `Ctrl+K` to search across all entities instantly
- **Keyboard Shortcuts** — Press `?` to see all shortcuts
- **CSV Import/Export** — Bulk data operations for contacts and leads
- **Dark/Light Theme** — System preference detection with manual toggle
- **Mobile Responsive** — Slide-in sidebar with hamburger menu
- **i18n** — English and Portuguese (Brazil) with one-click switching
- **Skeleton Loading** — Animated placeholders during data fetch
- **Confirm Modals** — Promise-based confirmation dialogs
- **Cache Persistence** — Instant loads from localStorage on repeat visits

## Getting Started

### Prerequisites
- Node.js 18+
- Java 21+
- Maven

### Frontend
```bash
cd crm-mvp
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Backend
```bash
cd crm-backend
./mvnw spring-boot:run
```
API available at [http://localhost:8080/api](http://localhost:8080/api)

### Default Login
- **Email:** admin@crm.com
- **Password:** secret123

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/register` | Register new user |
| GET/POST | `/api/customers` | List/Create customers |
| GET/PUT/DELETE | `/api/customers/:id` | Read/Update/Delete customer |
| GET/POST | `/api/leads` | List/Create leads |
| PUT/DELETE | `/api/leads/:id` | Update/Delete lead |
| GET/POST | `/api/companies` | List/Create companies |
| GET/POST | `/api/tasks` | List/Create tasks |
| GET/POST | `/api/activities` | List/Create activities |
| GET/POST | `/api/emails` | List/Create email logs |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/dashboard/pipeline` | Pipeline breakdown |
| GET | `/api/dashboard/revenue` | Revenue by month |
| GET | `/api/dashboard/activities/recent` | Recent activities |

## Project Structure

```
crm-mvp/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Analytics dashboard
│   ├── leads/              # Kanban lead pipeline
│   ├── contacts/           # Customer management
│   ├── companies/          # Company directory
│   ├── tasks/              # Task management
│   ├── activities/         # Activity logging
│   ├── emails/             # Email tracking
│   ├── reports/            # Analytics reports
│   ├── about/              # Portfolio showcase page
│   ├── login/              # Authentication
│   └── register/           # User registration
├── components/
│   ├── charts/             # Recharts visualizations
│   ├── providers.tsx       # QueryClient + localStorage cache
│   ├── app-shell.tsx       # Layout with sidebar
│   ├── sidebar.tsx         # Navigation sidebar
│   ├── global-search.tsx   # Ctrl+K search modal
│   ├── keyboard-shortcuts.tsx
│   ├── confirm-modal.tsx   # Promise-based confirm
│   ├── skeleton.tsx        # Loading skeletons
│   └── theme-toggle.tsx    # Dark/Light switcher
├── lib/
│   ├── api.ts              # Base API config
│   ├── auth.ts             # Auth helpers + JWT
│   ├── schemas.ts          # Zod validation schemas
│   ├── csv.ts              # CSV import/export
│   ├── i18n/               # Internationalization
│   ├── customers.ts        # Customer API
│   ├── leads.ts            # Lead API
│   ├── companies.ts        # Company API
│   ├── tasks.ts            # Task API
│   ├── activities.ts       # Activity API
│   ├── emails.ts           # Email API
│   └── dashboard.ts        # Dashboard API
└── types/                  # TypeScript type definitions
```

## Author

**Jhonata Rusaffa**
- [GitHub](https://github.com/jntcode)
- [LinkedIn](https://www.linkedin.com/in/jhonata-silva-181675373/)

## License

MIT
