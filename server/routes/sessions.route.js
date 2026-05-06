import express from "express";
import { requireRole } from "../middleware/requireRole.middleware.js";
import { createSession, getSessionAttendance, getMyBatchSessions } from "../controllers/session.controller.js";

const router = express.Router();

router.post("/", requireRole(["trainer"]), createSession);

// get attendance
router.get("/my", requireRole(["student","trainer"]), getMyBatchSessions);
router.get("/:id/attendance", requireRole(["trainer"]), getSessionAttendance)

export default router;