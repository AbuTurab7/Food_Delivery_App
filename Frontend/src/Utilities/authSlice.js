import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name : "authSlice",
    initialState : {
        userData : null,
        myOrders: [],
    },
    reducers : {
        addUser : (state , action) => {
            state.userData =  action.payload;
        },
        removeUser : (state) => {
            state.userData = null;
        },
        setMyOrders: (state, action) => {  
            state.myOrders = action.payload;
        },
        addToMyOrders: (state, action) => {   
            state.myOrders = [action.payload, ...state.myOrders];
        },
        setOrderStatus: (state , action) => {
            const {orderId , status} = action.payload
            const order = state.myOrders.find(o=>o._id==orderId)
            if(order){
                order.orderStatus = status;
            }
        }
    }
})

export const {addUser , removeUser , setMyOrders,  addToMyOrders , setOrderStatus } = authSlice.actions;
export default authSlice.reducer;