import 'dotenv/config'
import express from "express";
import cors from "cors";
import dns from "dns";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { sql } from "./db.js";
import batchRoutes from "./routes/batches.route.js";
import sessionRoutes from "./routes/sessions.route.js";
import attendanceRoutes from "./routes/attendance.route.js";
import authRoutes from "./routes/auth.route.js";
import institutionRoutes from "./routes/institutions.route.js";
import programmeRoutes from "./routes/programme.route.js";

dns.setDefaultResultOrder("ipv4first");
const app = express();
app.use(cors());
app.use(express.json());

sql`SELECT 1`
  .then(() => console.log("✅ DB connected"))
  .catch(err => console.log("❌ DB error:", err));

// 1. Clerk middleware
app.use(clerkMiddleware());

// 2. /auth/register — no req.user needed
app.use("/auth", authRoutes);

// 3. Attach req.user from DB for all routes below
app.use(async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const result = await sql`
      SELECT * FROM users WHERE clerk_user_id = ${userId}
    `;
    if (!result.length) {
      return res.status(404).json({ error: "User not found in DB" });
    }
    req.user = result[0];
    next();
  } catch (err) {
    res.status(500).json({ error: "Auth error" });
  }
});

// 4. /me route — now has req.user
app.get("/auth/me", (req, res) => {
  res.json(req.user);
});

// 5. All other routes
app.use("/batches", batchRoutes);
app.use("/sessions", sessionRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/institutions", institutionRoutes);
app.use("/programme", programmeRoutes);

app.listen(5000, () => console.log("Server running on 5000"));