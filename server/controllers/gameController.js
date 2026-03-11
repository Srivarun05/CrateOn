import Game from "../models/Game.js";
import Comment from "../models/comment.js"; 
import Rating from "../models/Rating.js";
import Favorite from "../models/Favorite.js";
import fs from "fs";


export const createGame = async (req, res) => {
    try {
        let { name, description, genre } = req.body;

        if (!name || !description || !genre || !req.file) {
            return res.status(400).json({ 
                message: "Please provide name, description, genre, and cover image" 
            });
        }

        const gameExists = await Game.findOne({ name });
        if (gameExists) {
            return res.status(400).json({ 
                message: "Game already exists in the database" 
            });
        }

        if (typeof genre === 'string') {
            genre = genre.split(',').map(g => g.trim());
        } else if (!Array.isArray(genre)) {
            genre = [genre];
        }

        const imagePath = req.file.path.replace(/\\/g, "/");                                                                    

        const game = await Game.create({
            name,
            description,
            genre,
            image: imagePath
        });

        res.status(201).json({ data: game });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getGames = async (req, res) => {
    try {
        const games = await Game.find();
        
        res.status(200).json({ 
            success: true, 
            count: games.length, 
            data: games 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getGameById = async (req, res, next) => {
    try {
        const gameId = req.params.id;

        const game = await Game.findById(gameId);

        if (!game) {
            res.status(404);
            throw new Error("Game not found");
        }

        res.status(200).json({ success: true, data: game });
    } catch (error) {
        if (error.name === "CastError") {
            res.status(404);
            return next(new Error("Game not found"));
        }
        next(error);
    }
};

export const updateGame = async (req, res, next) => {
    try {
        let { name, description, genre } = req.body;

        const game = await Game.findById(req.params.id);
        if (!game) {
            res.status(404);
            throw new Error("Game not found");
        }

        if (name && name !== game.name) {
            const exist = await Game.findOne({ name });
            if (exist) {
                return res.status(400).json({ message: "A game with this name already exists" });
            }
            game.name = name;
        }
        if (genre) {
            if (typeof genre === 'string') {
                genre = genre.split(',').map(g => g.trim());
            } else if (!Array.isArray(genre)) {
                genre = [genre];
            }
            
            if (genre.length === 0) {
                return res.status(400).json({ message: "Genre cannot be empty" });
            }
            game.genre = genre;
        }

        if (req.file) {
            if (game.image) {
                fs.unlink(game.image, (err) => {
                    if (err) console.error("Failed to delete old image:", err);
                });
            }
            game.image = req.file.path.replace(/\\/g, "/");
        }

        if (description) game.description = description;

        const updatedGame = await game.save();

        res.status(200).json({ data: updatedGame });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteGame = async (req, res) => {
    try {
        const gameId = req.params.id;
        const game = await Game.findById(gameId);
        
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }

        if (game.image) {
            fs.unlink(game.image, (err) => {
                if (err) console.error("Failed to delete image file:", err);
            });
        }

        await Comment.deleteMany({ game: gameId });
        await Rating.deleteMany({ game: gameId });
        await Favorite.deleteMany({ game: gameId });

        await Game.findByIdAndDelete(gameId);

        res.status(200).json({ 
            success: true, 
            message: "Game deleted successfully" 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};