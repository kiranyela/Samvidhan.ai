import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

export const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("MONGO DB CONNECTED SUCCESSFULLY");
    } catch (error) {
        console.log("MONGO DB CONNECTION FAILED (ERROR) :",error);
    }
}