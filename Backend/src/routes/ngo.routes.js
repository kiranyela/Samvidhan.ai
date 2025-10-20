import { Router } from 'express';
import { registerNgo, loginNgo,  requestOtp, verifyOtp } from '../controllers/ngoregister.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();
//register
router.route("/register").post(
    upload.single('registrationCertificate'),
    registerNgo
);
//login
// router.route("/login").post(loginNgo);
//otp request
router.post("/otp/request", requestOtp);
//verify otp
router.post("/otp/verify", verifyOtp);

export default router;