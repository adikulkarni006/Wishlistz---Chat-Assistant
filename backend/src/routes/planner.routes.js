import express from "express";
import {
  giftPlannerController,
  tripPlannerController
} from "../controllers/planner.controller.js";

const router = express.Router();

// One endpoint per planner
router.post("/gift", giftPlannerController);
router.post("/trip", tripPlannerController);

export default router;
