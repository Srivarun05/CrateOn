import mongoose from "mongoose";

const gameStatusSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    game: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Game", 
        required: true 
    },
    status: {
        type: String,
        enum: ['Playing', 'Plan to Play', 'Completed', 'Paused', 'Dropped'],
        required: true
    },
    playTime: { 
        type: Number, 
        default: 0 
    },
    startDate: { 
        type: Date 
    },
    endDate: { 
        type: Date 
    },
    ngPlus: { 
        type: Number, 
        default: 0 
    }, 
    notes: { 
        type: String, 
        default: "" 
    }
    
}, { timestamps: true });

gameStatusSchema.index({ user: 1, game: 1 }, { unique: true });

export default mongoose.model("GameStatus", gameStatusSchema);