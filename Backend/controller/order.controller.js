import Order from "../models/order.model.js";

export const postPlaceOrder = async (req, res) => {
    if(!req.user) return res.status(400).json({message: "User not found! , Please login."});
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

export const getMyOrders = async (req , res) => {
  try {
    if(!req.user) return res.status(400).json({message: "User not found! , Please login."});
// console.log(req.user);
    // if(req.user.role === "user"){
      const order = await Order.find({});
      return res.status(201).json(order);
  // } else if(req.user.role === "owner"){
    // const order = await getMyOrdersById({userId: req.user.userId});
    //   return res.status(201).json(order);
  // }
  } catch (error) {
    console.error(" Error in getting orders ", error);
    res.status(500).json({ message: "Server error" });
  }
}