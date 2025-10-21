const orderItemSchema = new mongoose.Schema({
    item: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "ItemModel"
    },
    price: Number,
    quantity: Number
} , { timestamps: true });

const orderSchema = new mongoose.schema(
  {
    
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cod , online"],
      require: true,
    },

    deliveryAddress: {
      text: String,
      latitude: Number,
      longitude: Number,
      require: true,
    },
    deliveryAddress: {
      type: Number,
      require: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RestaurantModel",
      require: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    orderItem: [orderItemSchema]
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model("OrderModel", orderSchema);
