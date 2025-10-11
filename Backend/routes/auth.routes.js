import { Router } from "express";
import {
  postRegistration,
  postLogin,
  getLogout,
  postSendOtp,
  postVerifyOtp,
  postResetPassword,
  postGoogleAuth,
} from "../controller/auth.controller.js";
import { getCurrentUser } from "../controller/user.controller.js";
import { verifyAuthentication } from "../middleware/verify-auth-middleware.js";

const authRouter = Router();

authRouter.route("/registration").post(postRegistration);
authRouter.route("/login").post(postLogin);
authRouter.route("/logout").get(getLogout);
authRouter.route("/send-otp").post(postSendOtp);
authRouter.route("/verify-otp").post(postVerifyOtp);
authRouter.route("/reset-password").post(postResetPassword);
authRouter.route("/google").post(postGoogleAuth);
authRouter.route("/user").get(verifyAuthentication , getCurrentUser);

export default authRouter;
