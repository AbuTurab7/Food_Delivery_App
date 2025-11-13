import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});


export const sendOtpEmail = async (to , otp) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Reset your password",
    html: `<p>Your OTP for reset password is <b>${otp}</b>. It will expires in 5 minutes.</p>`, 
  });

  console.log("Message sent:", info.messageId);
};
export const sendDeliveryOtpMail = async (to , otp) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "OTP for delivery",
    html: `<p>Your OTP this order is <b>${otp}</b>. It will expires in 5 minutes.</p>`, 
  });

  console.log("Message sent:", info.messageId);
};