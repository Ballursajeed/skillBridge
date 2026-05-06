import express from "express";
import { requireRole } from "../middleware/requireRole.middleware.js";
import { getInstitutionSummary, getTrainers } from "../controllers/institutions.controller.js";

const router = express.Router();

router.get("/:id/summary", requireRole(["institution", "programme_manager"]), getInstitutionSummary);
router.get("/:id/trainers",requireRole(["institution"]),getTrainers) // trainers under institution

export default router;