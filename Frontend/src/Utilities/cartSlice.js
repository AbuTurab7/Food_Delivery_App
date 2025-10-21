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
            const existingItem = state.cartItems.find((cartItem) => cartItem.id === item.id);
            if(existingItem){
                existingItem.quantity += 1;
            } else {
                state.cartItems = [...state.cartItems , {...item , quantity : 1 }];
            }
            state.restInfo = restInfo
            localStorage.setItem("cartData" , JSON.stringify(state.cartItems))
            localStorage.setItem("restInfo" , JSON.stringify(restInfo));
        },
        increaseQuantity: (state , action) => {
            const index = action.payload;
            state.cartItems[index].quantity += 1;
            localStorage.setItem("cartData" , JSON.stringify(state.cartItems));
        },
        decreaseQuantity: (state , action) => {
            const index = action.payload;
            if(state.cartItems[index].quantity > 1){
                state.cartItems[index].quantity -= 1;
            } else {
                state.cartItems.splice(index , 1);
            }
            localStorage.setItem("cartData" , JSON.stringify(state.cartItems));
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


export const {addToCart , increaseQuantity , decreaseQuantity , deleteItem , clearCart  } = cartSlice.actions

export default cartSlice.reducer;