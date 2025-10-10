import { email } from "zod";
import {
  authenticateUser,
  comparePassword,
  createUser,
  findUserByEmail,
  generateOtp,
  getHashedPassword,
} from "../services/auth.services.js";
import {
  loginValidation,
  registrationValidation,
  resetPasswordValidation,
  sendOtpValidation,
  verifyOtpValidation,
} from "../validation/auth-validation.js";
import { sendOtpEmail } from "../utils/nodemailer.js";

// Registration Page
// post
export const postRegistration = async (req, res) => {
  try {
    const { success, data, error } = registrationValidation.safeParse(req.body);

    if (!success) {
      const fieldErrors = {};
      error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      return res.status(400).json({ errors: fieldErrors });
    }

    const { fullname, email, password, mobile, role } = data;
    let user = await findUserByEmail(email);

    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await getHashedPassword(password);

    user = await createUser({
      fullname,
      email,
      password: hashedPassword,
      mobile,
      role,
    });

    await authenticateUser({ res, userId: user._id });

    return res.status(201).json({ message: "Registration successful!", user });
  } catch (error) {
    console.error("Post registration error : ", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// login page
// post
export const postLogin = async (req, res) => {
  try {
    const { data, error } = loginValidation.safeParse(req.body);
    if (error) {
      return res.status(400).json({ message: error.issues[0].message });
    }
    const { email, password } = data;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "User does not exists!" });
    }

    const isPasswordSame = await comparePassword(user.password, password);

    if (!isPasswordSame) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    await authenticateUser({ res, userId: user._id });
    return res.status(201).json({ message: "Login successful!", user });
  } catch (error) {
    console.error("Post login error : ", error);
  }
};

// getLogout
export const getLogout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    return res.status(201).json({ message: "Logout successfully!" });
  } catch (error) {
    console.error(" logout error : ", error);
    return res.status(500).json({ message: "Logout Failed!" });
  }
};

// send otp page
// post
export const postSendOtp = async (req, res) => {
  try {
    const { data, error } = sendOtpValidation.safeParse(req.body);
    if (error) {
      return res.status(400).json({ message: error.issues[0].message });
    }
    const user = await findUserByEmail(data.email);
    if (!user)
      return res.status(400).json({ message: "User does not exists!" });

    const otp = await generateOtp();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    sendOtpEmail(data.email, otp);

    return res.status(201).json({ message: "OTP send successfully!" });
  } catch (error) {
    console.error(" OTP sending error : ", error);
    return res.status(500).json({ message: "OTP sent failed!" });
  }
};

// verify OTP page
// post
export const postVerifyOtp = async (req, res) => {
  try {
    const { data, error } = verifyOtpValidation.safeParse(req.body);
    if (error) {
      return res.status(400).json({ message: error.issues[0].message });
    }

    const { email, otp } = data;

    const user = await findUserByEmail(email);

    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid OTP!" });
    }
    user.isOtpVarified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(201).json({ message: "OTP verified successfully!" });
  } catch (error) {
    console.error(" OTP veriication error : ", error);
    return res.status(500).json({ message: "OTP veriication failed!" });
  }
};

// Reset password page
// post
export const postResetPassword = async (req, res) => {
  try {
    const { data, error } = resetPasswordValidation.safeParse(req.body);
    if (error) {
      return res.status(400).json({ message: error.issues[0].message });
    }
    const { email, newPassword, confirmPassword } = data;

    const user = await findUserByEmail(email);

    if (!user || !user.isOtpVarified) {
      return res.status(400).json({ message: "OTP verification required!" });
    }

    const hashedPassword = await getHashedPassword(confirmPassword);
    user.password = hashedPassword;
    user.isOtpVarified = false;
    await user.save();
    return res.status(201).json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error(" OTP reset password error : ", error);
    return res.status(500).json({ message: "Reset password failed!" });
  }
};
