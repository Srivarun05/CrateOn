import mongoose from "mongoose";

const gameSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Game name is required"],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    genre: {
        type: [String], 
        required: [true, "At least one genre is required"],
        enum: [
                "2D Platformer", "3D Platformer", "Action", "Action-Adventure", "Adventure",
                "Casual", "Co-op", "Combat", "Combat Racing", "Dark Fantasy", "eSports",
                "Exploration", "Fantasy", "First-Person Shooter", "FPS", "Free to Play",
                "Racing", "Hero Shooter", "Horror", "Indie", "JRPG", "Magic",
                "Mechs", "Multiplayer", "Online Co-Op", "Open World", "Battle Royale",
                "Post-apocalyptic", "Puzzle", "PvP", "Racing", "Retro", "Roguelike",
                "RPG", "Sci-fi", "Simulation", "Singleplayer", "Souls-like", "Space",
                "Sports", "Story Rich", "Strategy", "Survival", "Stealth",
                "Third-Person Shooter", "Turn-Based", "Zombies"
            ],
        default: []
    },
    image: {
        type:String,
        required: [true, "Please add a cover image"]
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Game = mongoose.model("Game", gameSchema);
export default Game;