import express from "express";
import { addcomment, getGameComments, updateComment, deleteComment } from "../controllers/commentController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/:gameId", getGameComments);
router.post("/:gameId", protect, addcomment);

router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);


export default router;