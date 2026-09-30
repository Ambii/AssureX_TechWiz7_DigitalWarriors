# Security Notes

These are concrete issues found while reading the actual source in this
public repository, in order of severity. This isn't generic security
advice — every item below is a specific line of code in `app.py`.

## 1. Live database credentials committed to a public repo — CRITICAL

`app.py`, top of file:

``

## 2. Hardcoded backdoor login credentials — CRITICAL

`app.py`, inside `login_user()`:

```python
if user.username.lower() == 'admin' and user.password == 'admin123':
    return {"role": "Admin", "username": "Admin"}
elif user.username.lower() == 'reviewer' and user.password == 'review123':
    return {"role": "Reviewer", "username": "Reviewer"}
elif user.username.lower() == 'customer' and user.password == 'customer123':
    return {"role": "Customer", "username": "Customer"}
```

This is a real backdoor: anyone who reads this public repo (which is
trivial — it's right here) can log in as **Admin** on any deployment
running this exact code, using `admin` / `admin123`, regardless of what's
in the actual `users` table. Same for Reviewer and Customer.

**Action:** remove this fallback entirely before any non-local deployment.
If it's needed for local dev/demo purposes, gate it behind an explicit
`if os.environ.get("ENV") == "development"` check, and never ship that flag
set in production.

## 3. Unsalted, single-round password hashing

`app.py`, both `register_user()` and `login_user()`:

```python
pwd_hash = hashlib.sha256(user.password.encode()).hexdigest()
```

Plain SHA-256 is fast and unsalted, which makes stored hashes vulnerable to
rainbow-table and brute-force attacks — it isn't designed for password
storage. Combined with issue #1 (the database being exposed), this
compounds the risk to any real user accounts already in the table.

**Action:** use a password-hashing library designed for this
(`passlib` with `bcrypt` or `argon2`, e.g. `passlib.hash.bcrypt`), which
adds per-password salt and deliberate slowness.

## 4. Permissive CORS combined with credentials

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    ...
)
```

Wildcard origins (`"*"`) combined with `allow_credentials=True` is a known
anti-pattern — most browsers will actually reject this combination at
runtime for credentialed requests, and where it is allowed, it means any
website can make authenticated requests to this API on a user's behalf.

**Action:** once there's a real frontend origin to deploy to, replace `"*"`
with an explicit list of allowed origins (e.g. `["https://your-frontend
domain"]`), or drop `allow_credentials=True` if cookies/credentialed
requests aren't actually needed (this API currently doesn't use cookies —
auth is just a plain JSON body per request — so credentials may not be
needed here at all).

## 5. No authentication on protected endpoints

None of `/api/claims/submit`, `/api/admin/stats`, `/api/ocr/scan`, etc.
check who's calling them. Role-based access is enforced only in the React
frontend (`ProtectedRoute` in `App.jsx`), which is purely a UX convenience —
anyone can call these endpoints directly with `curl` regardless of role.

**Action:** add real auth (e.g. a signed JWT issued at login, verified via
a FastAPI dependency on every protected route) before relying on role
separation for anything that matters.

## 6. Verbose error messages returned to clients

Several endpoints return raw exception text to the caller, e.g.:

```python
raise HTTPException(status_code=400, detail=str(e))
```

This can leak internal details (table/column names, query structure,
library stack traces) to anyone probing the API. Fine for local debugging;
worth replacing with generic client-facing messages (and logging the real
exception server-side) before production.

---

None of the above blocks the app from running as a demo/hackathon project.
But items #1 and #2 specifically mean this repo, as currently pushed
publicly, has a live credential leak and an authentication bypass — those
two are worth fixing regardless of the project's stage.
