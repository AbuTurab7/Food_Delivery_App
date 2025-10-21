import Order from "../models/order.model.js";

export const postPlaceOrder = async (req, res) => {
  try {
    const {
      userId,
      restaurant,
      items,
      deliveryAddress,
      totalAmount,
      paymentMode,
    } = req.body;
    if (!userId || !restaurant || !items || !deliveryAddress || !totalAmount || !paymentMode)
      return res.status(400).json({ message: "Missing required fields" });

    const order = await Order.create({
      userId,
      restaurant,
      items,
      deliveryAddress,
      totalAmount,
      paymentMode,
    });

    res
      .status(201)
      .json({ success: true, message: "Order placed successfully!", order });
  } catch (error) {
    console.error(" Error placing order:", error);
    res.status(500).json({ message: "Server error" });
  }
};
