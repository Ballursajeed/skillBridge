🚀 SkillBridge – Training & Attendance Management System

📌 Overview

SkillBridge is a role-based platform to manage training programs across institutions.
It enables trainers to conduct sessions, students to mark attendance, and program managers to monitor performance across institutions.

🧩 Features

👨‍🎓 Student

Join batches through secure invite links
View assigned sessions
Mark attendance (Present / Late / Absent)

👨‍🏫 Trainer

Create sessions for batches
View session-wise attendance
Generate invite links for students

🏫 Institution

Manage batches
Assign trainers to batches
View batch-level attendance summaries

📊 Programme Manager

Monitor attendance analytics across institutions

🔐 Authentication

Powered by Clerk
Role-based access control after login
First-time users select role via onboarding flow

🔗 Invite Flow

1. Trainer generates an invite link for a batch  
2. Student clicks the link and logs in  
3. System auto-enrolls the student into the batch  
4. Student can immediately access sessions and mark attendance  

🛠️ Tech Stack

Frontend:

-- React (Vite)
-- Axios
-- Clerk Auth

Backend:

-- Node.js (Express)
-- PostgreSQL (NeonDB)
-- REST APIs

## 🗄️ Database Design

Relational schema includes:
- Users (role-based)
- Institutions
- Batches
- Sessions
- Attendance
- Invites

📂 Project Structure

client/
  ├── dashboards/
  ├── components/
  ├── pages/
  └── api/

server/
  ├── controllers/
  ├── routes/
  ├── db.js
  └── index.js

⚙️ Setup Instructions

1. Clone repo

git clone https://github.com/yourusername/skillbridge.git
cd skillbridge

2. Backend setup

cd server
npm install

Create .env:

DATABASE_URL=your_neon_db_url
CLERK_SECRET_KEY=your_clerk_secret

Run:

npm run dev

3. Frontend setup

cd client
npm install

Create .env:

VITE_API=https://your-backend-url
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key

Run:

npm run dev

🌐 Deployment

Frontend: Vercel
Backend: Render
Database: Neon

⚠️ Assumptions & Limitations

- Attendance can be marked once per session (enforced on backend)
- Invite links are shareable and do not expire
- Role selection is required after first login
- Trainers are currently linked to institutions manually for testing/seeding purposes
- Trainer onboarding/invitation flow for institutions is not yet implemented

🚧 Future Improvements

- Session-based attendance window (start/end enforcement)
- Email-based invite system
- Admin panel for role management
- Pagination & filtering for large datasets
- Institution-based trainer onboarding/invite workflow


## 🔗 Live Demo

Frontend: https://skill-bridge-omega-vert.vercel.app  
Backend: https://skillbridge-server-fm7y.onrender.com

Note: Backend is hosted on Render free tier, so initial requests may take a few seconds.

## ⚙️ Notes

- Configured Vercel rewrites to support client-side routing
- Used environment-based API configuration for production


👤 Author
Sajeed Balluru