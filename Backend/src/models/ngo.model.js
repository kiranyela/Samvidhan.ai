import mongoose, { Schema, model } from "mongoose";

const NgoSchema = new Schema(
  {
    ngoName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    darpanUid: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    registeredState: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    registeredDistrict: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    ngoType: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    sector: {
      type: String,
      required: true,
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    officialwebsiteURL: {
      type: String,
      trim: true,
    },
    registrationCertificate: {
      type: String, // URL to the uploaded certificate file
      required: true,
    },

    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },

    // For token-based sessions (JWT refresh token)
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);


export const Ngo = model("Ngo", NgoSchema);
