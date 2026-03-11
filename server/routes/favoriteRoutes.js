import express from 'express';
import { toggleFavorite, getMyFavorites, getUserFavorites } from '../controllers/favoriteController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get("/", protect, getMyFavorites);
router.get("/user", protect, getUserFavorites);
router.post("/:gameId", protect, toggleFavorite);

export default router;