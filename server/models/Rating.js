import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
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
    rating: {
        type: Number,
        required: [true, "Please add a rating between 1 and 5"],
        min: 1,
        max: 5
    }
}, { timestamps: true });

ratingSchema.index({ user: 1, game: 1 }, { unique: true });

const Rating = mongoose.model("Rating", ratingSchema);
export default Rating;