import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectdb = async() =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected Successfully");
    } catch (error) {
        console.log(`Connection Failed ${error}`);
        process.exit(1);
    }
}

export default connectdb;


