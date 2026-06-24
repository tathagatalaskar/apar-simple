# APAR Management Portal — NIC (Simple Full-Stack)

A clean, secure full-stack APAR (Annual Performance Assessment Report) system.
**Employees** fill in their details, targets, and achievements; a single
**Authority** reviews every report, grades it, adds remarks, and can flag it.

**Stack:** React (Vite) + Tailwind · Spring Boot 3 (Java 17) · PostgreSQL · JWT auth · Docker

---

## Two roles

| Role | Can do |
|------|--------|
| **Employee** | Submit APAR (details + targets/achievements), view own reports + grades |
| **Authority** | View all submitted reports, add grade + remarks, flag a report |

Employees can only see their own reports. The authority sees everyone's.
Enforced on the backend — not just hidden in the UI.

---

## Demo accounts (password: `Password@123`)

| Role | Email |
|------|-------|
| Employee | employee@nic.in |
| Employee | priya@nic.in |
| Authority | authority@nic.in |

---

## Run it (Docker — easiest)

```bash
docker compose up --build
```
Then open **http://localhost:5173**. The database schema and demo data load
automatically.

Stop: `Ctrl+C`. Wipe DB too: `docker compose down -v`.

---

## Run it (manual, no Docker)

**Database**
```bash
createdb apar_db
psql -d apar_db -f db/init/01_schema.sql
psql -d apar_db -f db/init/02_seed.sql
```
**Backend** (needs Java 17 + Maven)
```bash
cd backend
export SPRING_DATASOURCE_PASSWORD=your_password
mvn spring-boot:run
```
**Frontend** (needs Node 20)
```bash
cd frontend
npm install
npm run dev
```

---

## Project structure

```
apar-simple/
├── docker-compose.yml
├── db/init/
│   ├── 01_schema.sql      # users, apar_reports, apar_targets
│   └── 02_seed.sql        # demo users + sample report
├── backend/               # Spring Boot API
│   └── src/main/java/gov/nic/apar/
│       ├── entity/        # User, AparReport, AparTarget
│       ├── repository/    # database access
│       ├── service/       # business logic
│       ├── security/      # JWT + login
│       ├── controller/    # REST endpoints
│       └── dto/           # request/response objects
└── frontend/              # React + Vite
    └── src/
        ├── pages/         # Login, Dashboard, SubmitReport, ReportDetail
        ├── components/    # Layout, StatusBadge
        ├── api/           # axios client
        └── context/       # auth state
```

---

## API endpoints

| Method | Path | Role | Purpose |
|--------|------|------|---------|
| POST | `/api/auth/login` | public | Get JWT token |
| GET | `/api/v1/reports` | any | List reports (own / all) |
| GET | `/api/v1/reports/{id}` | any | One report |
| POST | `/api/v1/reports` | Employee | Submit a new APAR |
| PUT | `/api/v1/reports/{id}/review` | Authority | Grade / remark / flag |

---

## Security

JWT stateless auth · BCrypt password hashing · CORS whitelist · server-side
`@Valid` validation · SQL-injection-safe (JPA parameter binding) · role checks
enforced in the service layer · security headers (X-Frame-Options, nosniff).
