import argon2 from "argon2";
import { User } from "../models/user.model.js";

export const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

export const getHashedPassword = async (password) => {
  return argon2.hash(password);
};
export const comparePassword = async (hashedPassword , password) => {
  return argon2.verify(hashedPassword , password);
};
export const createUser = async ({
  fullname,
  email,
  password,
  mobile,
  role,
}) => {
  return User.create({
    fullname,
    email,
    password,
    mobile,
    role,
  });
};

export const generateToken = async (userId) => {
  return jwt.sign({userId} , process.env.JWT_KEY , {expiresIn: "7d"} );
};

export const authenticateUser = async ({ userId }) => {

    const token = await generateToken(userId);

    res.cookie("accessToken" , token , {
        secure: false,
        sameSite:"strict",
        maxAge:7*24*60*60*1000,
        httpOnly: true
    })

    return res.redirect("/");
}


