import {
  authenticateUser,
  comparePassword,
  createUser,
  findUserByEmail,
  getHashedPassword,
} from "../services/auth.services.js";
import {
  loginValidation,
  registrationValidation,
} from "../validation/auth-validation.js";

// Registration Page
// post
export const postRegistration = async (req, res) => {
  try {
    const { data, error } = registrationValidation.safeParse(req.body);
    if (error) {
      const errors = error.issues[0].message;
      req.flash("errors", errors);
      return res.redirect("/register");
    }
    const { fullname, email, password, mobile, role } = data;
    let user = await findUserByEmail(email);
    if (user) {
      req.flash("errors", "User already exist!");
      return res.redirect("/login");
    }
    const hashedPassword = await getHashedPassword(password);

    user = await createUser({
      fullname,
      email,
      password: hashedPassword,
      mobile,
      role,
    });

    await authenticateUser({ userId: user._id });
  } catch (error) {
    console.error("Post registration error : ", error);
  }
};

// login page
// post
export const postLogin = async (req, res) => {
  try {
    const { data, error } = loginValidation.safeParse(req.body);
    if (error) {
      const errors = error.issues[0].message;
      req.flash("errors", errors);
      return res.redirect("/login");
    }
    const { email, password } = data;

    const user = await findUserByEmail(email);
    if (!user) {
      req.flash("errors", "User does not exist!");
      return res.redirect("/register");
    }

    const isPasswordSame = await comparePassword(hashedPassword, password);

    if (!isPasswordSame) {
      req.flash("errors", "Invalid email or password!");
      return res.redirect("/login");
    }

    await authenticateUser({ userId: user._id });
  } catch (error) {
    console.error("Post login error : ", error);
  }
};

// getLogout
export const getLogout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    req.flash("success", "Logout successfully!");
    return res.redirect("/login");
  } catch (error) {
    console.error(" logout error : ", error);
  }
};
