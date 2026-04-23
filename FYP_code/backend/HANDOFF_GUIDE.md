# FormLens — Backend Hand-off Guide

## 1. API Endpoints Reference

All frontend calls go through `src/api/axios.js` which reads `VITE_API_BASE_URL` from `.env.local`.

| Frontend Call (Axios) | Django URL | View | Auth Required |
|---|---|---|---|
| `POST /login/` | `myapp/urls.py → LoginView` | JWT cookie set | ❌ Public |
| `POST /logout/` | `LogoutView` | Clears `auth_token` cookie | ✅ Cookie JWT |
| `GET /me/` | `MeView` | Returns `role: admin\|student` | ✅ Cookie JWT |
| `POST /detection/` | `DetectionView` | ONNX form detection | ✅ Cookie JWT |
| `GET/POST /users/` | `UserView` | List / create users | ✅ Cookie JWT |
| `PUT/DELETE /users/<pk>/` | `UserView` | Edit / delete user | ✅ Cookie JWT |
| `POST /reset-password/` | `ResetPasswordView` | Change own password | ✅ Cookie JWT |
| `POST /forgot-password/` | `ForgotPasswordView` | Reset by email | ❌ Public |

> [!IMPORTANT]
> The frontend `.env.local` file must have `VITE_API_BASE_URL=http://127.0.0.1:8000`
> This file has already been created for you.

---

## 2. Current State (SQLite)

Right now the backend **automatically falls back to SQLite** if PostgreSQL is unreachable. This is controlled by this logic in `settings.py`:

```python
if use_sqlite_fallback and not postgres_reachable:
    DATABASES = { 'default': {'ENGINE': 'sqlite3', ...} }
```

This means **the app works immediately without Postgres** for development.

---

## 3. Switching to PostgreSQL (Step-by-Step)

### Step 1 — Install PostgreSQL

Download and install from: https://www.postgresql.org/download/windows/

During install, set a superuser password.

### Step 2 — Create the database

Open **pgAdmin** or **psql** and run:

```sql
CREATE USER superadmin WITH PASSWORD '12345';
CREATE DATABASE university_db OWNER superadmin;
GRANT ALL PRIVILEGES ON DATABASE university_db TO superadmin;
```

### Step 3 — Install psycopg2

```bash
pip install psycopg2-binary
```

### Step 4 — Configure `.env`

The `backend/.env` file already has the correct values:

```
DB_NAME = "university_db"
DB_USER = "superadmin"
DB_PASSWORD = "12345"
DB_HOST = "localhost"
DB_PORT = "5432"
```

To **disable the SQLite fallback** and force Postgres, add or update:

```
USE_SQLITE_FALLBACK = 0
```

### Step 5 — Apply Migrations

```bash
cd "Final Part Website/FYP_code/backend"
python manage.py makemigrations
python manage.py migrate
```

### Step 6 — Create Admin User

```bash
python manage.py createsuperuser
```

Or re-run the quick script:

```bash
python -c "import os, django; os.environ.setdefault('DJANGO_SETTINGS_MODULE','Backend.settings'); django.setup(); from django.contrib.auth import get_user_model; User=get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin','admin@example.com','admin123')"
```

### Step 7 — Start the server

```bash
python manage.py runserver
```

---

## 4. Deployment Checklist

| Task | Status |
|---|---|
| `DEBUG = False` in `settings.py` | ⬜ Before deployment |
| `ALLOWED_HOSTS = ['yourdomain.com']` | ⬜ Before deployment |
| `secure=True` on `set_cookie` in `views.py` | ⬜ Before deployment |
| `CORS_ALLOWED_ORIGINS` updated to prod domain | ⬜ Before deployment |
| `USE_SQLITE_FALLBACK = 0` with real Postgres | ⬜ Before deployment |
| `npm run build` and serve with Nginx/Vercel | ⬜ Frontend build |
| `gunicorn Backend.wsgi` for Django production | ⬜ Backend deploy |
| `MODEL_PATH` in `.env` pointing to `weights.onnx` | ✅ Done |

---

## 5. Frontend `.env.local`

```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

For production, change this to your deployed backend URL, e.g.:
```
VITE_API_BASE_URL=https://api.formlens.yourdomain.com
```
