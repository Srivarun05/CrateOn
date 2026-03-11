import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
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
    comment: {
        type: String,
        required: [true, "Please add a comment"]
    }
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
