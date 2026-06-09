import express from "express";

import {
  createVehicle,
  getVehicles,
  searchVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController.js";

import {
  verifyToken,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  getVehicles
);

router.get(
  "/:plate",
  searchVehicle
);

router.post(
  "/",
  verifyToken,
  createVehicle
);

router.put(
  "/:id",
  verifyToken,
  updateVehicle
);

router.delete(
  "/:id",
  verifyToken,
  deleteVehicle
);

export default router;