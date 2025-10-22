import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  restaurant: {
    id: String,   
    name: String, 
    image: String,
    restAddress: String,
    subHeader: String,
    rating: String,
    cuisines: [{
        type: String,    
    }], 
  },
  items: [
    {
      itemId: String,
      name: String,
      quantity: Number,
      price: Number,
      itemImage: String
    }
  ],
  deliveryAddress: {
    text: String,
    lat: Number,
    lon: Number
  },
  totalAmount: String,
  orderStatus: {
    type: String,
    enum: ["pending", "accepted", "preparing", "out_for_delivery", "delivered"],
    default: "pending"
  },
  paymentMode: {
    type: String,
    enum: ["COD", "Online"],
    default: "COD"
  },
} , {timestamps : true});

const Order = mongoose.model("Order", orderSchema);
export default Order;
