import mongoose from "mongoose";

 const userSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
    },
    mobile:{
        type: Number,
        required: true
    },
    // role:{
    //     type: String,
    //     required: true,
    //     enum:["user", "owner", "deliveryBoy"]
    // },
    resetOtp:{
        type: String()
    },
    isOtpVarified:{
        type:Boolean
    },
    otpExpires:{
        type: Date
    },
} , {timestamps: true});

export const User = mongoose.model("User" , userSchema);