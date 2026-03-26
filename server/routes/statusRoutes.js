import express from "express";
import { setGameStatus, getUserStatuses } from "../controllers/statusController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, getUserStatuses);
router.put("/:gameId", protect, setGameStatus);

export default router;