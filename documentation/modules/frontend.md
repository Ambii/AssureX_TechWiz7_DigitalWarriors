# Frontend (`assurex-frontend/`)

React 19 + Vite 8 SPA. Routing via `react-router-dom` v7, icons via
`lucide-react`. No state-management or data-fetching library (no Redux,
no React Query) — state is local `useState`/Context only.

## Structure

```
src/
├── App.jsx                  Routes + ProtectedRoute wrapper
├── main.jsx                 Entry point
├── context/AuthContext.jsx  Role state (in-memory only, see note below)
├── components/
│   ├── Layout.jsx
│   ├── Navbar.jsx
│   └── Sidebar.jsx
└── pages/
    ├── login.jsx             Login modal + landing page
    ├── CustomerDashboard.jsx
    ├── SubmitClaim.jsx       Claim submission form → POST /api/claims/submit
    ├── ClaimDetails.jsx
    ├── AdminDashboard.jsx
    ├── UserManagement.jsx
    ├── ReviewQueue.jsx
    └── LiveEvaluator.jsx
```

## Auth flow

`login.jsx` posts credentials to `POST /api/auth/login`. On success, it
calls `login(role, username)` from `AuthContext`, which stores `userRole` in
React state, then navigates based on role (`/admin`, `/reviewer`,
`/evaluator`, or `/customer`).

**Note:** `AuthContext` holds role in memory only — no `localStorage`, no
cookie, no token. A page refresh loses the session and returns the user to
`/` (login). There's also no logout call to the backend (no session to
invalidate server-side, since there isn't one).

## Routing & role gating

`App.jsx`'s `ProtectedRoute` component checks `userRole` against an
`allowedRoles` array and redirects to `/` if it doesn't match. This is
**client-side only** — see `docs/architecture/overview.md` and
`docs/SECURITY.md` for why this doesn't actually protect the backend
endpoints themselves.

| Route | Component | Allowed roles |
|---|---|---|
| `/` | `Login` | Public |
| `/customer` | `CustomerDashboard` | Customer |
| `/submit-claim` | `SubmitClaim` | Customer |
| `/claim/:id` | `ClaimDetails` | Any authenticated role |
| `/admin` | `AdminDashboard` | Admin |
| `/admin/users` | `UserManagement` | Admin |
| `/reviewer` | `ReviewQueue` | Reviewer |
| `/evaluator` | `LiveEvaluator` | Admin, Evaluator |

## Duplicate login files

There are two files that could be the login page: `pages/login.jsx` and
`pages/Login.css` co-located as expected, but note the filename casing —
`App.jsx` imports `from './pages/login'` (lowercase). On case-sensitive
filesystems (Linux CI, most deploy targets) make sure the actual file is
named `login.jsx` and not `Login.jsx`, or the build will fail even though it
works fine locally on Windows/macOS's case-insensitive filesystems.

## Backend connection — inconsistent across pages

There is no shared API base-URL config (no `.env`, no constant, no fetch
wrapper). Each page hardcodes its own URL, and they're inconsistent:

| Page | Fetch target |
|---|---|
| `login.jsx` | `http://localhost:8000/api/auth/login` |
| `UserManagement.jsx` | `http://localhost:8000/api/auth/register` |
| `CustomerDashboard.jsx` | `http://localhost:8000/api/ocr/scan` |
| `AdminDashboard.jsx` | `/api/admin/stats` (relative) |
| `SubmitClaim.jsx` | `/api/claims/submit` (relative) |

The relative-path calls will only reach the backend if a dev proxy is
configured (none currently exists in `vite.config.js`) or the frontend is
served from the same origin as the API in production. Right now, in a
typical `npm run dev` setup, `AdminDashboard.jsx` and `SubmitClaim.jsx` will
call the Vite dev server itself, not the FastAPI backend, and will 404.
Before deploying anywhere beyond `localhost:8000`, this should be
consolidated into a single configurable base URL (e.g. a `VITE_API_URL` env
var read via `import.meta.env`) and applied consistently across all pages.
