import Comment from "../models/comment.js";
import Game from "../models/Game.js";

export const addcomment = async (req, res, next) => {
    try {
        const gameId = req.params.gameId;
        const userId = req.user._id;
        const { comment } = req.body; 

        const game = await Game.findById(gameId);
        if (!game) {
            res.status(404);
            throw new Error("Game not found");
        }

        const newComment = await Comment.create({
            user: userId,
            game: gameId,
            comment 
        });

        res.status(201).json({ success: true, data: newComment });

    } catch (error) {
        next(error);
    }
};

export const getGameComments = async (req, res, next) => {
    try {
        const gameId = req.params.gameId;

        const comments = await Comment.find({ game: gameId }).populate("user", "username");

        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments
        });
    } catch (error) {
        next(error);
    }
};

export const updateComment = async (req, res, next) => {
    try {
        const commentId = req.params.id; 
        const { comment } = req.body;

        const existingComment = await Comment.findById(commentId);
        if (!existingComment) {
            res.status(404);
            throw new Error("Comment not found");
        }

        if (existingComment.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            res.status(403); 
            throw new Error("You are not authorized to edit this comment");
        }

        existingComment.comment = comment;
        const updatedComment = await existingComment.save();

        res.status(200).json({ success: true, data: updatedComment });
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.id;

        const existingComment = await Comment.findById(commentId);
        if (!existingComment) {
            res.status(404);
            throw new Error("Comment not found");
        }

        if (req.user.role !== "admin") {
            res.status(403);
            throw new Error("Only administrators are authorized to delete comments");
        }

        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({ success: true, message: "Comment deleted successfully by Admin" });
    } catch (error) {
        next(error);
    }
};