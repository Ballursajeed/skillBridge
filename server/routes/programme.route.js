import express from "express";
import { requireRole } from "../middleware/requireRole.middleware.js";
import { getProgrammeSummary } from "../controllers/programme.controller.js";

const router = express.Router();

router.get("/summary", requireRole(["programme_manager", "monitoring_officer"]), getProgrammeSummary);

export default router;