import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { PASSPORT as passport } from "./config/passport.js";
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import ngoRouter from "./routes/ngo.routes.js";



const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// session middleware (needed for passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes


app.use("/api/v1/users", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/v1/ngos", ngoRouter);

export { app };
