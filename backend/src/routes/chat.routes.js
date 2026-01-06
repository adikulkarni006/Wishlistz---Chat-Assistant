import express from "express";
import { chatHandler } from "../controllers/chat.controller.js";
import authOptionalMiddleware from "../middlewares/authOptional.middleware.js";

const router = express.Router();

// Chat route (guest + logged-in users)
router.post("/", authOptionalMiddleware, chatHandler);

export default router;
