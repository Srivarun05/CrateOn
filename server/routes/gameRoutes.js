import express from "express";
import { createGame, getGames, getGameById, updateGame, deleteGame } from "../controllers/gameController.js";
import { protect, adminOnly } from "../middlewares/auth.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/games", getGames);

router.post("/game", protect, adminOnly, upload.single("image"), createGame);
router.get("/game/:id", getGameById);
router.put("/game/:id", protect, adminOnly,upload.single("image"), updateGame);
router.delete("/game/:id", protect, adminOnly, deleteGame);

export default router;