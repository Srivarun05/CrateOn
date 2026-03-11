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
        enum: ["Action", "RPG", "FPS", "Strategy", "Adventure", "Simulation", "SoulsLike", "OpenWorld", "Dark-Fantasy", "Indie"],
        default: []
    },
    image: {
        type:String,
        required: [true, "Please add a cover image"]
    }
}, { timestamps: true });

const Game = mongoose.model("Game", gameSchema);
export default Game;