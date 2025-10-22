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
    }
})

export const {addUser , removeUser , setMyOrders,  addToMyOrders } = authSlice.actions;
export default authSlice.reducer;