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
    const { success, data , error } = registrationValidation.safeParse(req.body);

    if (!success) {
      const fieldErrors = {};
      error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      return res.status(400).json({ errors: fieldErrors });
    }

    const { fullname, email, password, mobile } = data;
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
      // role,
    });

    await authenticateUser({  res, userId: user._id });

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
      console.log("verification error : " , error);
      return res.status(400).json({ message: error.issues[0].message });
      // const errors = error.issues[0].message;
      // req.flash("errors", errors);
      // return res.redirect("/login");
    }
    const { email, password } = data;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "User does not exists!" });
    }

    const isPasswordSame = await comparePassword(user.password , password);

    if (!isPasswordSame) {
       return res.status(400).json({ message: "Invalid email or password!" });
    }

    await authenticateUser({ res , userId: user._id });
    return res.status(201).json({ message: "Login successful!", user });
  } catch (error) {
    console.error("Post login error : ", error);
  }
};

// // getLogout
// export const getLogout = async (req, res) => {
//   try {
//     res.clearCookie("accessToken");
//     req.flash("success", "Logout successfully!");
//     return res.redirect("/login");
//   } catch (error) {
//     console.error(" logout error : ", error);
//   }
// };
