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

const authRouter = Router();

authRouter.route("/registration").post(postRegistration);
authRouter.route("/login").post(postLogin);
authRouter.route("/logout").get(getLogout);
authRouter.route("/send-otp").post(postSendOtp);
authRouter.route("/verify-otp").post(postVerifyOtp);
authRouter.route("/reset-password").post(postResetPassword);
authRouter.route("/google").post(postGoogleAuth);

export default authRouter;
