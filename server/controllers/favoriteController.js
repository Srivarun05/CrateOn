import Favorite from "../models/Favorite.js";
import Game from "../models/Game.js";

export const toggleFavorite = async (req, res, next) => {
    try{
        const gameId = req.params.gameId;
        const userId = req.user._id;

        const game = await Game.findById(gameId);
        if(!game) {
            res.status(404);
            throw new Error("Game not found");
        }

        const existingFavorite = await Favorite.findOne({ user: userId, game: gameId });

        if(existingFavorite) {
            await Favorite.findByIdAndDelete(existingFavorite._id);
            res.status(200).json({ message: "Removed from favorites" });
        }else {
            await Favorite.create({ user: userId, game: gameId });
            res.status(201).json({ message: "Added to favorites" });
        }
    } catch(error) {
        next(error);
    }
};

export const getMyFavorites = async (req, res, next) => {
    try {
        const favorites = await Favorite.find({ user: req.user._id }).populate("game");

        res.status(200).json({
            count: favorites.length,
            data: favorites
        });
    } catch(error) {
        next(error);
    }
};

export const getUserFavorites = async (req, res, next) => {
    try {
        const favorites = await Favorite.find({ user: req.user._id }).populate("game");

        res.status(200).json({ 
            success: true, 
            count: favorites.length, 
            data: favorites 
        });
    } catch (error) {
        next(error);
    }
};