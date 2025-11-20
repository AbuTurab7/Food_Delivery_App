import { useDispatch, useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { Link, useNavigate } from "react-router";
import "./myOrders.css";
import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { serverURL } from "./Home";
import { setOrderStatus } from "../Utilities/authSlice";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import "./deliveryBoyOrder.css";

export const DeliveryBoyOrder = () => {
  const userData = useSelector((state) => state.authSlice.userData);
  const myOrders = useSelector((state) => state.authSlice.myOrders);
  const navigate = useNavigate();

  if(!userData){
      return (
        <div className="my-orders-main-container">
          <MyOrderShimmer />
        </div>
      );
    }
  
  if (!myOrders || myOrders.length === 0) {
    return (
      <div className="no-orders">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="No orders"
        />
        <h3>No orders yet</h3>
        <p>You haven't received any delivery assignments yet.</p>
      </div>
    );
  }

  return (
    <div className="my-orders-main-container">
      <div className="my-orders-container">
        <h4>My Orders</h4>
        {error && <p className="error-msg">{error}</p>}

        {myOrders?.map((order) => (
          <div
            className="my-order-container"
            key={order._id}
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`order-details/${order._id}`)}
          >
            <div className="my-order-header">
              <div className="my-order-header-left">
                <p id="order">Order #{order._id.slice(0, 6)}</p>
                <p id="date">{order.createdAt.slice(0, 10)}</p>
              </div>

              <div className="my-order-header-right">
                {order.orderStatus !== "Delivered" ? (
                  <p style={{ color: "blue" }}>Pending</p>
                ) : (
                  <p style={{ color: "green" }}>Completed</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
