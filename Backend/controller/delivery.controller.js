import Order from "../models/order.model.js";
import { User } from "../models/user.model.js";

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
    order.orderStatus = "out_for_delivery";
    await order.save();

    return res.status(200).json({
      message: `Order assigned successfully to ${deliveryBoy.fullname}!`,
      order,
    });
  } catch (error) {
    console.error("Error in assigning delivery boy:", error);
    res.status(500).json({ message: error.message });
  }
};
