# How to Run, Show & Submit — APAR Portal

A simple guide to demo the project to your teacher, showing the **database, backend,
and frontend** side by side with the running app.

---

# PART 1 — Run it (one command)

1. Install **Docker Desktop** (https://www.docker.com/products/docker-desktop/) and launch it.
2. Open a terminal in the project folder (the one with `docker-compose.yml`).
3. Run:
   ```bash
   docker compose up --build
   ```
4. Wait ~2 minutes, then open **http://localhost:5173**

Demo logins (password `Password@123`): `employee@nic.in`, `authority@nic.in`
(click the demo buttons on the login screen to auto-fill).

---

# PART 2 — The demo flow

### As the Employee
1. Log in as `employee@nic.in`.
2. Click **New APAR**.
3. Fill officer name, department, designation, year, self-appraisal, and add a couple
   of target/achievement rows.
4. Click **Submit Report**. It appears on your dashboard as **Submitted**.
5. Log out.

### As the Authority
1. Log in as `authority@nic.in`.
2. You now see **all** submitted reports (including the one you just made and the
   pre-seeded one from Priya).
3. Open a report. Select a **grade**, write **remarks**, and optionally tick
   **Flag this report** with a reason.
4. Click **Save Review**. Status becomes **Reviewed**.
5. Log out.

### Back as the Employee
1. Log in as `employee@nic.in`, open your report.
2. You now see the grade, remarks, and flag the authority gave you.

That's the full cycle: **employee submits → authority reviews → employee sees result.**

---

# PART 3 — Showing your teacher each layer

When your teacher says "show me the X", here's exactly what to open.

## "Show me the DATABASE"
While the app is running, open a second terminal and run:
```bash
docker exec -it apar_simple_db psql -U apar_admin -d apar_db
```
Then at the `apar_db=#` prompt, type these to show real records:
```sql
-- show all users
SELECT id, email, full_name, role FROM users;

-- show all submitted reports
SELECT id, officer_name, status, grade, is_flagged FROM apar_reports;

-- show targets for report 1
SELECT target_text, achievement FROM apar_targets WHERE report_id = 1;

-- list the tables
\dt
```
Type `\q` to exit. **This proves the data is really being stored.**

*Tip:* submit a report in the app, then re-run the `SELECT` — your teacher sees the
new row appear live. That's a strong demo moment.

## "Show me the BACKEND code"
Open these files (in your editor or on GitHub):

| File | What to say |
|------|-------------|
| `backend/.../entity/AparReport.java` | "This maps to the database table." |
| `backend/.../service/ReportService.java` | "This is the business logic — submit and review, with the role checks." |
| `backend/.../controller/ReportController.java` | "These are the REST API endpoints the frontend calls." |
| `backend/.../security/SecurityConfig.java` | "JWT authentication and security setup." |

## "Show me the FRONTEND code"

| File | What to say |
|------|-------------|
| `frontend/src/pages/SubmitReport.jsx` | "The employee's form to submit an APAR." |
| `frontend/src/pages/ReportDetail.jsx` | "Where the authority grades and flags." |
| `frontend/src/pages/Dashboard.jsx` | "The list of reports — own for employee, all for authority." |
| `frontend/src/api/api.js` | "How the frontend talks to the backend." |

## "Show me how they connect"
> "Sir, the React frontend sends a request — for example when the employee clicks
> Submit, `api.js` sends a POST to `/api/v1/reports`. That hits `ReportController`
> in Spring Boot, which calls `ReportService` to validate and save it through JPA
> into the PostgreSQL `apar_reports` table. When the authority reviews it, the same
> path updates the grade and flag. Everything is protected by JWT login."

---

# PART 4 — Upload to GitHub (to show code + demo together)

```bash
cd apar-simple
git init
git add .
git commit -m "APAR Management Portal - full stack"
# create an empty repo on github.com, then:
git remote add origin https://github.com/<your-username>/apar-portal.git
git branch -M main
git push -u origin main
```
GitHub auto-displays the README. During the demo, keep two tabs open:
**the GitHub repo** (code) and **http://localhost:5173** (running app). Switch
between them as you explain.

---

# PART 5 — Submit

**As a GitHub link:** submit the repo URL.

**As a ZIP:**
```bash
cd ..
zip -r apar-portal.zip apar-simple -x "*/node_modules/*" -x "*/target/*" -x "*/dist/*" -x "*/.env"
```

In your note, write:
> "Run with `docker compose up --build`, open http://localhost:5173.
> Login: employee@nic.in / authority@nic.in, password Password@123."

---

# PART 6 — Troubleshooting

| Problem | Fix |
|---------|-----|
| `docker: command not found` | Docker Desktop not installed/running. |
| Port already in use | Change the left number in `docker-compose.yml` (e.g. `5174:80`). |
| Login fails right after start | Backend still booting — wait for "Started AparApplication", retry. |
| `relation does not exist` | Run `docker compose down -v` then `docker compose up --build`. |

---

# IMPORTANT — be ready to explain

Your teacher will likely ask you to explain a file you open. Before the demo, read
through `ReportService.java`, `ReportController.java`, and the two main React pages,
and make sure you can explain in your own words: how submit works, how review works,
and how login protects the API. Understanding it matters more than the demo itself.
