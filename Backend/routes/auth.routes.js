import { Router } from "express";
import {
  postRegistration,
  postLogin,
  getLogout,
  postSendOtp,
  postVerifyOtp,
  postResetPassword,
} from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.route("/registration").post(postRegistration);
authRouter.route("/login").post(postLogin);
authRouter.route("/logout").get(getLogout);
authRouter.route("/send-otp").post(postSendOtp);
authRouter.route("/verify-otp").post(postVerifyOtp);
authRouter.route("/reset-password").post(postResetPassword);

export default authRouter;
