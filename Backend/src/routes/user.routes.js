import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken } from "../controllers/register.controller.js";

const router = Router();

router.route("/register").post(registerUser)

router.route("/login").post(loginUser);

//secured routes

router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken)



export default router;