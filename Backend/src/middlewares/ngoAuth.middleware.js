import jwt from "jsonwebtoken";
import { Ngo } from "../models/ngo.model.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyNGOJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiError(401, "Unauthorized request");
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded?._id) throw new ApiError(401, "Invalid access token");

    const ngo = await Ngo.findById(decoded._id).select("-otp -otpExpiry -refreshToken");
    if (!ngo) throw new ApiError(401, "Unauthorized NGO");
    req.ngo = ngo;
    next();
  } catch (err) {
    next(new ApiError(401, err.message || "Invalid access token"));
  }
};

// If request has an NGO token and the NGO is unverified, block; otherwise allow.
export const blockUnverifiedNGOIfPresent = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return next(); // no token -> allow public access
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch {
      return next(); // not a valid token for our purposes; treat as public
    }
    if (!decoded?._id) return next();
    const ngo = await Ngo.findById(decoded._id).select("isVerified");
    if (!ngo) return next(); // not an NGO token (could be user) -> allow
    if (!ngo.isVerified) {
      return res.status(403).json({ success: false, message: "NGO not verified" });
    }
    return next();
  } catch (e) {
    return next();
  }
};
