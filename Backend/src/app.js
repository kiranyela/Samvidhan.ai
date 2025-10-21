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

// centralized error handler (returns JSON instead of HTML)
// must be after routes
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";
  return res.status(status).json({
    success: false,
    message,
  });
});

export { app };
