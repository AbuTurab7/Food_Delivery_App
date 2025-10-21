import { configureStore } from "@reduxjs/toolkit"
import cartSlice from "./cartSlice";
import filterSlice from "./filterSlice";
import authSlice from "./authSlice";
import mapSlice from "./mapSlice"

const store = configureStore(
    {
        reducer : {
            cartSlice : cartSlice,
            filterSlice : filterSlice,
            authSlice : authSlice,
            mapSlice : mapSlice,
        }
    }
)
export default store;
