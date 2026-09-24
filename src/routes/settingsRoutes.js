import express from "express";

import {
  getSettings,
  updateSettings,
} from "../controllers/settingsController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Pública: la página del cliente necesita el intervalo para estimar el próximo service.
router.get("/", getSettings);

router.put("/", verifyToken, updateSettings);

export default router;
