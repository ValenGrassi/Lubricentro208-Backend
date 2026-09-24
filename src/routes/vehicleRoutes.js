import express from "express";

import {
  createVehicle,
  getVehicles,
  searchVehicle,
  updateVehicle,
  deleteVehicle,
  markRecontacted,
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

router.patch(
  "/:id/recontacto",
  verifyToken,
  markRecontacted
);

router.delete(
  "/:id",
  verifyToken,
  deleteVehicle
);

export default router;