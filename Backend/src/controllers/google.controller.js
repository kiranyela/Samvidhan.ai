import { generateAccessAndRefreshTokens } from "./register.controller.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const googleAuthCallback = async (req, res) => {
  try {
    const user = req.user; // provided by passport

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options);

    // redirect to frontend with success
    res.redirect(`${process.env.CORS_ORIGIN}/home`);
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.redirect(`${process.env.CORS_ORIGIN}/login?error=oauth_failed`);
  }
};
