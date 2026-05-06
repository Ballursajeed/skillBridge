import express from "express";
import { requireRole } from "../middleware/requireRole.middleware.js";
import { markAttendance } from "../controllers/attendance.controller.js";

const router = express.Router();

router.post("/mark", requireRole(["student"]), markAttendance);

export default router;