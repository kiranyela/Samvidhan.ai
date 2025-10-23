import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Ngo } from "../models/ngo.model.js";

export const listUsers = asyncHandler(async (req, res) => {
  const { verified } = req.query;
  const filter = {};
  if (typeof verified !== 'undefined') {
    filter.isVerified = String(verified).toLowerCase() === 'true';
  }
  const users = await User.find(filter).select("-password -refreshToken").sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, "Users fetched", users));
});

export const verifyUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");
  if (user.isVerified) return res.status(200).json(new ApiResponse(200, "Already verified", user));
  user.isVerified = true;
  await user.save();
  return res.status(200).json(new ApiResponse(200, "User verified", user));
});

export const setRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!['user','admin'].includes(role)) throw new ApiError(400, 'Invalid role');
  const user = await User.findByIdAndUpdate(id, { $set: { role } }, { new: true }).select("-password -refreshToken");
  if (!user) throw new ApiError(404, 'User not found');
  return res.status(200).json(new ApiResponse(200, 'Role updated', user));
});

// NGOs
export const listNgos = asyncHandler(async (req, res) => {
  const { verified } = req.query;
  const filter = {};
  if (typeof verified !== 'undefined') {
    filter.isVerified = String(verified).toLowerCase() === 'true';
  }
  const ngos = await Ngo.find(filter).select("-otp -otpExpiry -refreshToken").sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, "NGOs fetched", ngos));
});

export const verifyNgo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ngo = await Ngo.findById(id);
  if (!ngo) throw new ApiError(404, "NGO not found");
  if (ngo.isVerified) return res.status(200).json(new ApiResponse(200, "Already verified", ngo));
  ngo.isVerified = true;
  await ngo.save();
  return res.status(200).json(new ApiResponse(200, "NGO verified", ngo));
});
