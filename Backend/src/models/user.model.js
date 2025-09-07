import mongoose,{Schema,model} from 'mongoose';
import dotenv,{ configDotenv } from 'dotenv';
import bcrypt from "bcrypt";

const userSchema= new Schema({
    fullName :{
        type: String,
        required:true,
        unique:true,
        lower:true,
        trim:true,
        index:true,
    },
    email:{
        type : String,
        required:true,
        lower:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,

    },
    refreshToken:{
        type:String,
    }


},{timestamps:true});


export const User = model("User",userSchema);