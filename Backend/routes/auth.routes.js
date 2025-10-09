import { Router } from "express";
import { getLogout, postLogin, postRegistration } from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.route("/registration").post(postRegistration);
authRouter.route("/login").post(postLogin);
authRouter.route("/logout").get(getLogout);

export default authRouter;