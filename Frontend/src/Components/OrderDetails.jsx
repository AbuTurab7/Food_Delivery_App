import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import "./orderDetails.css";
import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import { serverURL } from "./Home";
import {
  addToMyOrders,
  setDeliveryBoy,
  setOrderStatus,
  updateOrder,
} from "../Utilities/authSlice";
import toast from "react-hot-toast";
import { OrderTrackingMap } from "./OrderTrackingMap";

export const OrderDetails = () => {
  const { id } = useParams();
  const userData = useSelector((state) => state.authSlice.userData);
  const myOrders = useSelector((state) => state.authSlice.myOrders);
  const order = myOrders.find((o) => o._id === id);

  // console.log(userData);
  // console.log(order);

  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [deliveryOTP, setDeliveryOTP] = useState("");


  const handleSendDeliveryOTP = async () => {
    setBtnDisabled(true);
    setError(null);
    console.log(order.userId.email);
    
    try {
      const res = await fetch(`${serverURL}/api/send-delivery-otp/${order._id}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email : order.userId.email}),
        credentials: "include"
      });
      const result = await res.json();
      if(!res.ok){
        setError(result.message);
        return;
      }
      console.log(result);
      toast.success(result.message);
       setModalShow(true);
       setBtnDisabled(false);
    } catch (error) {
      console.error(`Error in sending OTP : `, error);
      setError("There's a issue in sending OTP");
    }
  }
  const handleVerifyDeliveryOtp = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${serverURL}/api/verify-delivery-otp/${order._id}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({deliveryOTP , email: order.userId.email}),
        credentials: "include"
      });
      const result = await res.json();
      if(!res.ok){
        setError(result.message);
        return;
      }
      dispatch(setOrderStatus({orderId : order._id, status : "Delivered" }));
      setModalShow(false);
      toast.success(result.message);
    } catch (error) {
      console.error(`Error in OTP verification : `, error);
      setError("There's a issue in OTP verification");
    }
  }

  if (!userData || !order) {
    return <p>Loading order details...</p>;
  }
  return (
    <div className="my-orders-main-container">
      <div className="my-orders-container">
        <div className="body">
          <div className="order-details">
            {/* <div className="order-details-header"> */}
            <div className="order-detail-left">
              <p>Order #{order?._id?.slice(0, 6)}</p>
              <p>{order?.createdAt?.slice(0, 10)}</p>
            </div>
            <div className="order-detail-right">
              <p>{order?.paymentMode}</p>
              {order.orderStatus !== "Delivered" ? (
                <p style={{ color: "blue" }}>Pending</p>
              ) : (
                <p style={{ color: "green" }}>Completed</p>
              )}
            </div>
          </div>
          <div className="order-details-border"></div>
          <div className="restaurant-details">
            <div className="rest-details-left">
              <img
                height={"60px"}
                width={"60px"}
                style={{ borderRadius: "5px" }}
                src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/${order.restaurant.image}`}
                alt=""
              />
            </div>
            <div className="rest-detail-right">
              <p>{order.restaurant.name}</p>
              <p>{order.restaurant.restAddress}</p>
            </div>
          </div>
          <div className="order-details-border"></div>
          <div className="customer-details">
            <div className="customer-detail-header">
              <div className="customer-detail-left">
                <p>{userData.fullname}</p>
                <p>{order.deliveryAddress.text}</p>
              </div>
              <div className="customer-detail-right">
                <p>+91 {userData.mobile}</p>
                <p>{userData.email}</p>
              </div>
            </div>
            {order.orderStatus !== "Delivered" && <OrderTrackingMap order={order}/>}
          </div>
          <div className="order-summary-container">
            <p id="checkout-title" style={{ margin: "10px 0" }}>
              Order Summary
            </p>
            {order.items?.map((item, i) => (
              <div className="cart-item-container" key={i}>
                <div className="cart-details-container">
                  <div className="cart-item-name">
                    <img
                      height={"25px"}
                      width={"25px"}
                      src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/${item.itemImage}`}
                      alt="logo"
                    />
                    <p style={{ fontSize: "14px", color: "#02060C" }}>
                      {item?.name}
                    </p>
                  </div>
                  <div className="cart-item-btn-container">
                    <p style={{ fontSize: "15px", color: "#02060CEB" }}>
                      {" "}
                      ₹{item?.price / 100}
                      <span id="item-quantity-first">x{item.quantity}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="order-summary-footer">
              <div className="to-pay">
                <p>Total</p>
                <p>₹{order?.totalAmount}</p>
              </div>
            </div>
          </div>
          {error && <p className="error-msg">{error}</p>}
          {
            (userData.role === "deliveryBoy" && order.orderStatus !== "Delivered") && <button id="delivered-btn" disabled={btnDisabled} onClick={() => {
            handleSendDeliveryOTP();
          }}>
            Mark as Delivered
          </button>
          }
          
          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={modalShow}
            id="deliveryOTP-modal"
            onHide={() => setModalShow(false)}
          >
            <Modal.Body>
              <div className="deliver-otp-container">
                  <input type="text" placeholder="Enter OTP" value={deliveryOTP} onChange={(e) => setDeliveryOTP(e.target.value)} />
                  <button id="delivered-btn" onClick={handleVerifyDeliveryOtp}>
                    Verify
                  </button>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
};
