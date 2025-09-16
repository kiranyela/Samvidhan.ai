import { Router } from "express";
import passport from "passport";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
} from "../controllers/register.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { googleAuthCallback } from "../controllers/google.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleAuthCallback
);

// secured routes
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);

export default router;
