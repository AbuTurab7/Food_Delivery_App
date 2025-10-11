import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name : "authSlice",
    initialState : {
        userData : null,
    },
    reducers : {
        addUser : (state , action) => {
            state.userData =  action.payload;
        },
        removeUser : (state) => {
            state.userData = null;
        }
    }
})

export const {addUser , removeUser } = authSlice.actions;
export default authSlice.reducer;