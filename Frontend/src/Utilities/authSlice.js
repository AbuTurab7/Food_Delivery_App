import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name : "authSlice",
    initialState : {
        userData : JSON.parse(localStorage.getItem("userData"))
    },
    reducers : {
        addUser : (state , action) => {
            state.userData =  action.payload;
            localStorage.setItem("userData", JSON.stringify(action.payload))
        },
        removeUser : (state) => {
            state.userData = null;
            localStorage.removeItem("userData");
        }
    }
})

export const {addUser , removeUser } = authSlice.actions;
export default authSlice.reducer;