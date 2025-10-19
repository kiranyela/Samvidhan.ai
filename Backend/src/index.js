
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import { app } from "./app.js";

dotenv.config();

connectDB()
.then(()=>{
    const server = app.listen(process.env.PORT||5000,()=>{
        console.log("SERVER IS RUNNING ON PORT:",process.env.PORT||5000);
    });
    server.on("error",(err)=>{
        console.log("SERVER ERROR : ",err);
    })
})
.catch((error)=>{
    console.log("ERROR IN CONNECTING TO MONGODB ATLAS:",error);
})