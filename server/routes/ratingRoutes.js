import express from "express";
import { addOrUpdateRating, getGameRatings, removeRating } from "../controllers/ratingController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

const optionalProtect = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        return protect(req, res, next);
    }
    next();
};

router.get("/:gameId", optionalProtect, getGameRatings);
router.post("/:gameId", protect, addOrUpdateRating);
router.delete("/:gameId", protect, removeRating);

export default router;