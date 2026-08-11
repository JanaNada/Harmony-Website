# Running Harmony Club House on your own machine

Everything runs locally — you don't need anyone else's computer to be switched on.

You'll start **two** servers: the website (port 3000) and the API (port 4000).

---

## 1. Install these first

| | |
|---|---|
| **Node.js 20+** | https://nodejs.org — the LTS installer |
| **MySQL 8** | https://dev.mysql.com/downloads/installer/ — remember the root password you set |
| **Git** | https://git-scm.com/downloads |

Check they're there:

```bash
node -v
git --version
```

---

## 2. Get the code

```bash
git clone https://github.com/JanaNada/Harmony-Website.git
cd Harmony-Website
```

---

## 3. Install the packages

Two separate installs — one for the website, one for the API:

```bash
npm install
npm --prefix backend install
```

---

## 4. Set up your database connection

Copy the example env file and open it in a text editor:

```bash
copy backend\.env.example backend\.env
```

On macOS or Linux use `cp backend/.env.example backend/.env`.

Change **two** things in `backend/.env`:

- `DB_PASSWORD` — your MySQL root password
- `JWT_SECRET` — any long random string you invent

Leave the rest alone. This file is git-ignored, so your password never leaves your machine.

---

## 5. Build the database

This creates the database, every table, and your admin login in one go. Use your own email and a password of at least 8 characters:

```bash
node backend/scripts/setup-db.js --admin you@harmony.com --password yourpassword
```

You should see `Setup complete.` It's safe to run again — it won't wipe anything.

---

## 6. Start it

Two terminals, one command each.

Terminal 1 — the API:

```bash
npm --prefix backend start
```

Terminal 2 — the website:

```bash
npm run dev
```

Then open **http://localhost:3000** and sign in with the admin email and password from step 5.

---

## Making test accounts

Your database starts empty apart from your admin. To add more people:

```bash
node backend/scripts/set-password.js coord@harmony.com coordinator1 COORDINATOR
```

```bash
node backend/scripts/set-password.js client1@testmail.com testclient1 COMPANY
```

The third value is the role — `ADMIN`, `COORDINATOR` or `COMPANY`. Re-running with the same email just changes that person's password.

To see anything on the calendar, sign in as an admin and publish some available times first — a new database has none.

---

## If something goes wrong

**"Can't reach the server" when signing in**
The API isn't running. Check Terminal 1 — it should say `Server running on port 4000`.

**`ECONNREFUSED` or `Setup failed`**
MySQL isn't running. On Windows open Services and start `MySQL80`; on macOS `brew services start mysql`.

**`ER_ACCESS_DENIED_ERROR`**
`DB_PASSWORD` in `backend/.env` doesn't match your MySQL root password.

**Port 3000 or 4000 already in use**
Something else is on that port. Close it, or change `PORT` in `backend/.env` (if you change it, also set `BACKEND_URL=http://localhost:<new port>` in your environment before `npm run dev`).

**The page loads but nothing is clickable**
You're probably opening it through someone else's IP address instead of your own `localhost`. Use http://localhost:3000 on your own machine.

**Errors mentioning code you know you deleted**
Stale build cache. Delete the `.next` folder and start again.
