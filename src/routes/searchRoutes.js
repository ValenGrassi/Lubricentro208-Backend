import express from "express";

import {
  searchPlate,
} from "../controllers/searchController.js";

const router = express.Router();

router.get("/:plate", searchPlate);

export default router;