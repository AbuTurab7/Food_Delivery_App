const itemModelSchema = new mongoose.schema(
  {
    name: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RestaurantModel",
      require: true,
    },
    category: {
      type: String,
      enum: ["VEG , NON_VEG"],
    },
    price: {
      type: String,
      min: 0,
      require: true,
    },
  },
  { timestamps: true }
);

export const ItemModel = mongoose.model("ItemModel", itemModelSchema);
