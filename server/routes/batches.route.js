import express from "express";
import { requireRole } from "../middleware/requireRole.middleware.js";
import { createBatche, 
    generateInvite, 
    joinBatch, 
    getBatchSummary, 
    getMyBatches, 
    assignTrainer,
    getBatchTrainers,
    getBatchStudents
} from "../controllers/batches.controller.js"

const router = express.Router();

// CREATE BATCH
router.post("/", requireRole(["institution"]), createBatche);


// GENERATE INVITE LINK
router.post("/:id/invite", requireRole(["trainer"]), generateInvite);


// JOIN BATCH USING INVITE
router.post("/:id/join", requireRole(["student"]), joinBatch);

//assign trainer to a batch
router.post("/:id/assign-trainer", requireRole(["institution"]), assignTrainer);

router.get("/my", requireRole(["trainer"]), getMyBatches);
router.get("/:id/summary", requireRole(["institution"]), getBatchSummary);
router.get("/:id/trainers", requireRole(["institution"]), getBatchTrainers);
router.get("/:id/students", requireRole(["institution"]), getBatchStudents);

export default router;