import Order from "../models/order.model.js";
import RazorPay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

let instance = new RazorPay({
  key_id: process.env.RAZOR_KEY,
  key_secret: process.env.RAZOR_SECRET_KEY,
});
export const postPlaceOrder = async (req, res) => {
  if (!req.user)
    return res.status(400).json({ message: "User not found! , Please login." });
  try {
    const {
      userId,
      restaurant,
      items,
      deliveryAddress,
      totalAmount,
      paymentMode,
    } = req.body;
    if (
      !userId ||
      !restaurant ||
      !items ||
      !deliveryAddress ||
      !totalAmount ||
      !paymentMode
    )
      return res.status(400).json({ message: "Missing required fields" });

    if (paymentMode === "Online") {
      const razorOrder = await instance.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });
      const order = await Order.create({
        userId,
        restaurant,
        items,
        deliveryAddress,
        totalAmount,
        paymentMode,
        razorPayOrderId: razorOrder.id,
        payment: false,
      });
      return res
        .status(200)
        .json({ razorOrder , orderId: order._id });
    }

    const order = await Order.create({
      userId,
      restaurant,
      items,
      deliveryAddress,
      totalAmount,
      paymentMode,
    });

    return res
      .status(201)
      .json({ success: true, message: "Order placed successfully!", order });
  } catch (error) {
    console.error(" Error placing order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const postVerifyPayment = async (req , res) => {
  try {
    const {razorpay_payment_id , orderId} = req.body;
    const payment = await instance.payments.fetch(razorpay_payment_id)
    
    if(!payment || payment.status !== 'captured'){
      return res.status(400).json({message: "Payment not captured"})
    }
    const order = await Order.findById(orderId);
    if(!order){
      return res.status(400).json({message: "Order not found"});
    }
    order.payment = true;
    order.razorPayPaymentId = razorpay_payment_id;
    await order.save();
     return res
      .status(200)
      .json({ success: true, message: "Order placed successfully!", order });
 
  } catch (error) {
     console.error(" Error verifying payment:", error);
    res.status(500).json({ message: "Server error" });
  }
}
export const getMyOrders = async (req, res) => {
  try {
    if (!req.user)
      return res
        .status(400)
        .json({ message: "User not found! , Please login." });
    if (req.user.role === "deliveryBoy") {
      const order = await Order.find({ deliveryBoy: req.user.userId })
        .populate("userId", "fullname mobile email")
        .populate("restaurant.id")
        .sort({ createdAt: -1 });
      // console.log("order : ", order);

      return res.status(201).json(order);
    } else {
      const order = await Order.find({});
      return res.status(201).json(order);
    }
  } catch (error) {
    console.error(" Error in getting orders ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const postUpdateOrderStatus = async (req, res) => {
  try {
    if (!req.user)
      return res
        .status(400)
        .json({ message: "User not found! , Please login." });
    const { orderId } = req.params;
    const { status } = req.body;
    // console.log("os" , status);

    const order = await Order.findById(orderId);
    if (!order) return res.status(400).json({ message: "Order not found!" });
    if (req.user === "deliveryBoy") {
      if (!["delivered"].includes(status))
        return res.status(400).json({ message: "Invalid status update" });
    }
    order.orderStatus = status;
    await order.save();
    return res.status(201).json(order);
  } catch (error) {
    console.error(" Error in updating orders status ", error);
    res.status(500).json({ message: "Server error" });
  }
};
