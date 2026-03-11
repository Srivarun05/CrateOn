import express from "express";
import { addOrUpdateRating, getGameRatings } from "../controllers/ratingController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/:gameId", getGameRatings);
router.post("/:gameId", protect, addOrUpdateRating);

export default router;