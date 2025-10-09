import { configureStore } from "@reduxjs/toolkit"
import cartSlice from "./cartSlice";
import filterSlice from "./filterSlice";
import authSlice from "./authSlice";

const store = configureStore(
    {
        reducer : {
            cartSlice : cartSlice,
            filterSlice : filterSlice,
            authSlice : authSlice,
        }
    }
)
export default store;
