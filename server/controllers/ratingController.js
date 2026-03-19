import Rating from "../models/Rating.js";
import Game from "../models/Game.js";

export const addOrUpdateRating = async (req, res, next) => {
    try {
        const gameId = req.params.gameId;
        const userId = req.user._id;
        const { rating } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            res.status(400);
            throw new Error("Please provide a valid rating between 1 and 5");
        }

        const game = await Game.findById(gameId);
        if (!game) {
            res.status(404);
            throw new Error("Game not found");
        }

        let existingRating = await Rating.findOne({ user: userId, game: gameId });

        if (existingRating) {
            existingRating.rating = Number(rating);
            await existingRating.save();
            return res.status(200).json({ success: true, message: "Rating updated", data: existingRating });
        } else {
            const newRating = await Rating.create({
                user: userId,
                game: gameId,
                rating: Number(rating)
            });
            return res.status(201).json({ success: true, message: "Rating added", data: newRating });
        }
    } catch (error) {
        next(error);
    }
};

export const getGameRatings = async (req, res, next) => {
    try {
        const gameId = req.params.gameId;

        const ratings = await Rating.find({ game: gameId });

        let average = 0;
        if (ratings.length > 0) {
            const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
            average = (sum / ratings.length).toFixed(1); 
        }

        let userRating = 0;
        if (req.user) {
            const existingRating = ratings.find(r => r.user.toString() === req.user._id.toString());
            if (existingRating) {
                userRating = existingRating.rating;
            }
        }

        res.status(200).json({
            success: true,
            count: ratings.length,
            average: Number(average), 
            userRating: userRating,  
            data: ratings
        });
    } catch (error) {
        next(error);
    }
};

export const removeRating = async (req, res, next) => {
    try {
        const gameId = req.params.gameId;
        const userId = req.user._id;
        
        const deletedRating = await Rating.findOneAndDelete({ user: userId, game: gameId });

        if (!deletedRating) {
            return res.status(404).json({ success: false, message: "Rating not found" });
        }

        res.status(200).json({ success: true, message: "Rating removed successfully" });
    } catch (error) {
        next(error);
    }
};