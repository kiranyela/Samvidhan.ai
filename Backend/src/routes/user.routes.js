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
router.get("/me", verifyJWT, (req, res) => {
  // verifyJWT middleware attaches the user object to the request
  if (req.user) {
    const allowList = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const email = String(req.user.email || "").toLowerCase();
    const isAdmin = req.user.role === "admin" || allowList.includes(email);
    return res.status(200).json({
      user: {
        _id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
        isVerified: req.user.isVerified,
        isAdmin,
      },
    });
  }
  return res.status(404).json({ message: "User not found" });
});

export default router;
