import mongoose from "mongoose";

const restaurantSchema = new mongoose.schema({
    name: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subHeader: {
        type: String,
    },
    rating: {
        type: String,
    },
    cuisines: [{
        type: String,
        require: true     
    }],
    // items: {
    //     type: mongoose.schema.Types.ObjectId,
    //     ref: "itemModel"
    // }
},{timestamps: true});

export const RestaurantModel = mongoose.model("RestaurantModel" , restaurantSchema);