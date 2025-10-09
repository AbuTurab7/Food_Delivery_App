import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cartSlice",
    initialState: {
        cartItems: JSON.parse(localStorage.getItem("cartData")) || [],
        restInfo: JSON.parse(localStorage.getItem("restInfo")) || [],
    },
    reducers: {
        addToCart: (state, action) => {
            const  {item, restInfo} = action.payload
            state.cartItems = [...state.cartItems , item]
            state.restInfo = restInfo
            localStorage.setItem("cartData" , JSON.stringify(state.cartItems))
            localStorage.setItem("restInfo" , JSON.stringify(restInfo));
        },
        deleteItem: (state, action) => {
            state.cartItems = action.payload
            localStorage.setItem("cartData", JSON.stringify(action.payload));
        },
        clearCart: (state) => {
            state.cartItems = []
            state.restInfo = []
            localStorage.removeItem("cartData")
            localStorage.removeItem("restInfo");
        },
    },
});


export const {addToCart , deleteItem , clearCart } = cartSlice.actions

export default cartSlice.reducer;