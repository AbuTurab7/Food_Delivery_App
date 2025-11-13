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
    enum: ["Pending", "Accepted", "Preparing", "Out_for_delivery", "Delivered"],
    default: "Pending"
  },
  paymentMode: {
    type: String,
    enum: ["COD", "Online"],
    default: "COD"
  },
   deliveryBoy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  assignedAt: {
    type: Date
  },
   deliveryOtp:{
        type: String,
        default: null
    },
    otpExpires:{
        type: Date,
        default: null
    },
    payment:{
      type:Boolean,
      default: false
    },
    razorPayOrderId:{
      type: String,
      default: ""
    },
    razorPayPaymentId:{
      type: String,
      default: ""
    }
} , {timestamps : true});

const Order = mongoose.model("Order", orderSchema);
export default Order;
