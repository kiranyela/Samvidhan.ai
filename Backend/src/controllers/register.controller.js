import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// const generateAccessAndRefreshTokens= async(userId)=>{
//     try {
//         const user = await User.findById(userId);
//         const accessToken = user.generateAccessToken();
//         const refreshToken = user.generateRefreshToken();

//         user.refreshToken = refreshToken;
//         await user.save({validateBeforeSave:false});

//         return {accessToken,refreshToken};
//     } catch (error) {
//         throw new ApiError(500,'ERROR IN GENERATING ACCESS AND REFRESH TOKENS');
//     }
// }

// const generateAccessAndRefreshTokens = async (userId) => {
//     try {
//         const user = await User.findById(userId); 
//         if (!user) {
//             throw new ApiError(404, "User not found");
//         }

//         const accessToken = user.generateAccessToken();
//         const refreshToken = user.generateRefreshToken(); 

//         user.refreshToken = refreshToken;
//         await user.save({ validateBeforeSave: false });

//         return { accessToken, refreshToken };
//     } catch (error) {
//         throw new ApiError(500, "ERROR IN GENERATING ACCESS AND REFRESH TOKENS");
//     }
// };
const isProd = process.env.NODE_ENV === "production";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        console.log("DEBUG: user found for token generation:", user._id);

        const accessToken = user.generateAccessToken();
        console.log("DEBUG: accessToken generated:", accessToken);

        const refreshToken = user.generateRefreshToken();
        console.log("DEBUG: refreshToken generated:", refreshToken);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("DEBUG TOKEN ERROR:", error); // log the actual error
        throw new ApiError(500, "ERROR IN GENERATING ACCESS AND REFRESH TOKENS");
    }
};




const registerUser = asyncHandler(async (req, res) => {
    //recieve data from the user 
    const { fullName, email, username, password } = req.body;
    console.log("email:", email, "\nfullName :", fullName, "\nusername:", username);

    //check if any of the fields are empty 
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }
    //check if the user is already existed
    const existedUser = await User.findOne(
        { $or: [{ username }, { email }] }
    )

    if (existedUser) {
        throw new ApiError(409, "User with same username or email exists");
    }



    //store the user in the databasse 

    const user = await User.create(
        {
            fullName: fullName,
            email: email,
            password: password,
        }
    )

    // checking if the database is updated by getting the user from the db without password and refreshtokenz
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "ERROR IN UPDATING THE USER TO THE DATABASE")
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "user is successfully registered!")
    )
})


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!(email)) {
        throw new ApiError(400, "email is required");
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(404, "user doesn't exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(404, "incorrect password for the given username . please check and re-enter your password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only true in prod
        sameSite: isProd ? "none" : "lax"
    };


    res.status(200)
        .cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "user logged in successfully"));



})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        }, {
        new: true,
    }
    )
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only true in prod
        sameSite: isProd ? "none" : "lax"
    };


    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user loggedIn successfully "));

})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);
        if (!user || user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "unauthorized request");
        }
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // only true in prod
            sameSite: isProd ? "none" : "lax"
        };


        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200, {
                accessToken,
                refreshToken: newRefreshToken,
            }, "Access Token is refreshed successfully!!"));
    } catch (error) {
        throw new ApiError(500, "error in refreshing access token");
    }



})
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body



    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
        ))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        { new: true }

    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    getCurrentUser,
};