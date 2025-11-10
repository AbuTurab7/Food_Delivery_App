import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    userData: null,
    myOrders: [],
  },
  reducers: {
    addUser: (state, action) => {
      state.userData = action.payload;
    },
    removeUser: (state) => {
      state.userData = null;
    },
    setMyOrders: (state, action) => {
      state.myOrders = action.payload;
    },
    addToMyOrders: (state, action) => {
      state.myOrders = [action.payload, ...state.myOrders];
    },
    updateOrder: (state, action) => {
      const updatedOrder = action.payload;
      state.myOrders = state.myOrders.map((o) =>
        o._id === updatedOrder._id ? updatedOrder : o
      );
    },
    setOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.myOrders.find((o) => o._id == orderId);
      if (order) {
        order.orderStatus = status;
      }
    },
    setDeliveryBoy: (state, action) => {
      const { orderId, deliveryBoy } = action.payload;
      const order = state.myOrders.find((o) => o._id == orderId);
      if (order) {
        order.deliveryBoy = deliveryBoy;
      }
    },
  },
});

export const {
  addUser,
  removeUser,
  setMyOrders,
  addToMyOrders,
  updateOrder,
  setOrderStatus,
  setDeliveryBoy,
} = authSlice.actions;
export default authSlice.reducer;
