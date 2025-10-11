import argon2 from "argon2";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";


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

export const generateToken = async ({ userId, fullname , email , mobile , role }) => {
  return jwt.sign({ userId , fullname , email , mobile , role } , process.env.JWT_KEY , {expiresIn: "7d"} );
};

export const authenticateUser = async ({  res , user }) => {

    const token = await generateToken({
      userId: user._id,
      fullname: user.fullname,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    });

    res.cookie("accessToken" , token , {
        secure: false,
        sameSite:"strict",
        maxAge:7*24*60*60*1000,
        httpOnly: true
    })
    console.log(token);
}

export const generateOtp = async () => {
  return crypto.randomInt(100000 , 1000000).toString();
}

export const verifyToken = async (token) => {
  return jwt.verify(token , process.env.JWT_KEY);
}
