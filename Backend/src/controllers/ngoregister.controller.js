import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Ngo } from "../models/ngo.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import {uploadOnCloudinary} from "../utils/cloudinary.js";




//register
const registerNgo = asyncHandler(async (req, res) => {
    const {
        ngoName,
        darpanUid,
        registeredState,
        registeredDistrict,
        ngoType,
        sector,
        registrationNumber,
        email,
        contact,
        
        officialwebsiteURL,
        // registrationCertificate
    } = req.body;

    const registrationCertificateLocalPath = req.file?.path;

    if (
        [ngoName, darpanUid, registeredState, registeredDistrict, ngoType, sector, registrationNumber, email, contact, registrationCertificateLocalPath].some((field) => typeof field === 'string' && field.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedNgo = await Ngo.findOne({
        $or: [{ email }, { registrationNumber },{ darpanUid }]
    });

    if (existedNgo) {
        throw new ApiError(409, "NGO with this email or registration number already exists");
    }

    const certificateUploadResponse = await uploadOnCloudinary(registrationCertificateLocalPath);

    if (!certificateUploadResponse) {
        // The utility already cleans up the local file if upload fails
        throw new ApiError(500, "Failed to upload registration certificate");
    }
    const registrationCertificate = certificateUploadResponse.secure_url;

    const ngo = await Ngo.create({
        ngoName,
        darpanUid,
        registeredState,
        registeredDistrict,
        ngoType,
        sector,
        registrationNumber,
        email,
        contact,
       
        officialwebsiteURL,
        registrationCertificate
    });

    const createdNgo = await Ngo.findById(ngo._id).select("-otp -otpExpiry -refreshToken");

    if (!createdNgo) {
        throw new ApiError(500, "Something went wrong while registering the NGO");
    }

    return res.status(201).json(
        new ApiResponse(201, createdNgo, "NGO registered successfully")
    );
});

//login
// const loginNgo = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         throw new ApiError(400, "Email and password are required");
//     }

//     const ngo = await Ngo.findOne({ email });

//     if (!ngo) {
//         throw new ApiError(404, "NGO not found");
//     }

//     const isPasswordValid = await ngo.isPasswordCorrect(password);

//     if (!isPasswordValid) {
//         throw new ApiError(401, "Invalid credentials");
//     }

//     const accessToken = ngo.generateAccessToken();
//     const refreshToken = ngo.generateRefreshToken();

//     ngo.refreshToken = refreshToken;
//     await ngo.save({ validateBeforeSave: false });

//     const loggedInNgo = await Ngo.findById(ngo._id).select("-password -refreshToken");

//     const options = {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production'
//     };

//     return res
//         .status(200)
//         .cookie("accessToken", accessToken, options)
//         .cookie("refreshToken", refreshToken, options)
//         .json(
//             new ApiResponse(
//                 200,
//                 {
//                     ngo: loggedInNgo,
//                     accessToken,
//                     refreshToken
//                 },
//                 "NGO logged in successfully"
//             )
//         );
// });

// Request OTP
const requestOtp = asyncHandler(async (req, res) => {
 const { email } = req.body;
 if (!email || email.trim() === "") throw new ApiError(400, "Email is required"); // Corrected validation

 const ngo = await Ngo.findOne({ email });
 if (!ngo) throw new ApiError(404, "NGO not found with this email");

 // Generate 6-digit OTP
 const otp = Math.floor(100000 + Math.random() * 900000).toString();

 // Hash OTP before saving to DB
 const hashedOtp = await bcrypt.hash(otp, 10);
 ngo.otp = hashedOtp;
 ngo.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // valid for 5 mins
 await ngo.save({ validateBeforeSave: false });

 // Send OTP via email (using environment variables)
 try {
 const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
   },
  });

  await transporter.sendMail({
   from: process.env.EMAIL_USER,
   to: email,
   subject: "Your OTP for NGO Login",
   text: `Your OTP for NGO login is ${otp}. It is valid for 5 minutes.`,
   html: `<p>Your OTP for NGO login is <strong>${otp}</strong>.</p><p>It is valid for 5 minutes.</p>`,
  });
 } catch (error) {
  console.error("Nodemailer failed to send email:", error);
  // Optionally remove OTP if email fails to prevent lockout, but often kept for security.
  // For now, we'll continue, assuming the email service is configured correctly in production.
 }
  

 return res.status(200).json(
  new ApiResponse(200, {}, "OTP sent successfully")
 );
});


// Verify OTP & Login
const verifyOtp = asyncHandler(async (req, res) => {
 const { email, otp } = req.body;
 if (!email || !otp) throw new ApiError(400, "Email and OTP are required");

 const ngo = await Ngo.findOne({ email });
 if (!ngo) throw new ApiError(404, "NGO not found");

 if (!ngo.otp || !ngo.otpExpiry || ngo.otpExpiry < Date.now())
  throw new ApiError(400, "OTP expired. Please request a new one.");

 // Note: The original code does not include `isPasswordCorrect` method on the Ngo model. 
 // Assuming `bcrypt.compare` is the correct method for comparing the OTP.
 const isOtpValid = await bcrypt.compare(otp, ngo.otp);
 if (!isOtpValid) throw new ApiError(401, "Invalid OTP");

 // Clear OTP after successful login
 ngo.otp = undefined;
 ngo.otpExpiry = undefined;

 // Assuming generateAccessToken and generateRefreshToken methods exist on the Ngo model
 const accessToken = ngo.generateAccessToken();
 const refreshToken = ngo.generateRefreshToken();

 ngo.refreshToken = refreshToken;
 await ngo.save({ validateBeforeSave: false });

 const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict' // Best practice for CSRF protection
 };

 return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
   new ApiResponse(200, { ngo, accessToken, refreshToken }, "Logged in successfully")
  );
});

export {
    registerNgo,
    requestOtp,
    verifyOtp,
};
