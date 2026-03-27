import GameStatus from "../models/GameStatus.js";

export const setGameStatus = async (req, res, next) => {
    try {
        const { gameId } = req.params;
        
        const { status, playTime, startDate, endDate, ngPlus, notes } = req.body; 
        
        const userId = req.user._id;

        if (!status) {
            await GameStatus.findOneAndDelete({ user: userId, game: gameId });
            return res.status(200).json({ success: true, message: "Status removed" });
        }

        const updateData = { status };
        if (playTime !== undefined) updateData.playTime = playTime;
        if (startDate !== undefined) updateData.startDate = startDate || null;
        if (endDate !== undefined) updateData.endDate = endDate || null;
        if (ngPlus !== undefined) updateData.ngPlus = ngPlus;
        if (notes !== undefined) updateData.notes = notes;

        const gameStatus = await GameStatus.findOneAndUpdate(
            { user: userId, game: gameId },
            updateData,
            { returnDocument: 'after', upsert: true }
        );
        
        res.status(200).json({ success: true, data: gameStatus });
    } catch (error) { 
        next(error); 
    }
};

export const getUserStatuses = async (req, res, next) => {
    try {
        const statuses = await GameStatus.find({ user: req.user._id }).populate('game');
        res.status(200).json({ success: true, data: statuses });
    } catch (error) { 
        next(error); 
    }
};