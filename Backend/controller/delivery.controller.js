import Order from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { findUserByEmail, generateOtp } from "../services/auth.services.js";
import { sendDeliveryOtpMail } from "../utils/nodemailer.js";

// Get all delivery boys
export const getAllDeliveryBoys = async (req, res) => {
  if (!req.user)
    return res.status(400).json({ message: "User not found! Please login." });

  try {
    const deliveryBoys = await User.find({ role: "deliveryBoy" }).select(
      "_id fullname email"
    );

    if (!deliveryBoys || deliveryBoys.length === 0)
      return res.status(400).json({ message: "No delivery boy available!" });

    return res.status(200).json(deliveryBoys);
  } catch (error) {
    console.error("Error in getting delivery boys:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Assign delivery boy to order
export const postAssignDeliveryBoy = async (req, res) => {
  if (!req.user)
    return res.status(400).json({ message: "User not found! Please login." });

  try {
    const { orderId } = req.params;
    const { deliveryBoyId } = req.body;

    const deliveryBoy = await User.findOne({
      _id: deliveryBoyId,
      role: "deliveryBoy",
    });
    
    if (!deliveryBoy)
      return res.status(400).json({ message: "Delivery boy not found" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.deliveryBoy = deliveryBoy;
    order.assignedAt = new Date();
    order.orderStatus = "Out_for_delivery";
    await order.save();

    return res.status(200).json({
      message: `Order assigned successfully to ${deliveryBoy.fullname}`,
      order,
    });
  } catch (error) {
    console.error("Error in assigning delivery boy:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delivery otp
export const postSendDeliveryOTP = async (req , res) => {
    if (!req.user)
    return res.status(400).json({ message: "User not found! Please login." });

    try {
      const { orderId } = req.params;
    const { email } = req.body;
    const order = await Order.findById(orderId); 
    if (!order) return res.status(404).json({ message: "Order not found" });
    const customer = await findUserByEmail(email);
    if (!customer) return res.status(404).json({ message: "Invalid email!" });
    const otp = await generateOtp();
    order.deliveryOtp = otp;
    order.otpExpires = Date.now() + 5 * 60 * 1000;
    order.save();
    await sendDeliveryOtpMail( email , otp );
    return res.status(200).json({
      message: `OTP sent successfully`,
      order,
    });
    } catch (error) {
      console.error("Error in sending otp: ", error);
    res.status(500).json({ message: error.message });
    }
}

export const postVerifyDeliveryOTP = async (req , res) => {
    if (!req.user)
    return res.status(400).json({ message: "User not found! Please login." });
    try {
      const { orderId } = req.params;
    const { deliveryOTP , email } = req.body;
    const order = await Order.findById(orderId); 
    const customer = await findUserByEmail(email);

     if (!order || !customer || order.deliveryOtp !== deliveryOTP || order.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid OTP!" });
    }

    order.deliveryOtp = null;
    order.otpExpires = null;
    order.orderStatus = "Delivered"
    order.save();
    return res.status(200).json({
      message: `Order delivered`,
      order,
    });
    } catch (error) {
      console.error("Error in verifying otp: ", error);
    res.status(500).json({ message: error.message });
    }
}

