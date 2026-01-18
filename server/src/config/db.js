import mongoose from "mongoose";
import {env} from "../config/env.js";

export const connectDB = async ()=>{
    try {
        await mongoose.connect(env.mongoUri);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:',error);
        process.exit(1);
    }
};