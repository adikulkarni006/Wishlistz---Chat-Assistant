import express from "express";

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Navigation route working" });
});

export default router;
