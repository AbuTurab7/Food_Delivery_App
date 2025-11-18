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

  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);

  const handleOrderStatus = async ({ orderId, status }) => {
    setError(null);
    try {
      const res = await fetch(
        `${serverURL}/api/update-orders-status/${orderId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      }

      dispatch(setOrderStatus({ orderId, status }));
      toast.success("Order status updated!");
    } catch (error) {
      console.error("Error in updating status:", error);
      setError("There's an issue in updating status");
    }
  };

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
                {/* {order.orderStatus === "Out_for_delivery" ? (
                    <DropdownButton
                      id="dropdown-basic-button"
                      title="Mark as Delivered"
                      className={`custom-dropdown Pending`}
                    >
                      <Dropdown.Item
                        onClick={() =>
                          handleOrderStatus({
                            orderId: order._id,
                            status: "Delivered",
                          })
                        }
                      >
                        Delivered
                      </Dropdown.Item>
                    </DropdownButton>
                  ) : (
                    <p id="order-status" className={order.orderStatus}>
                      {order.orderStatus.replace(/_/g, " ")}
                    </p>
                  )} */}
              </div>
            </div>

            {/* <div className="my-order-body">
                <div className="my-order-body-lower">
                  {order.items.map((item, i) => (
                    <div className="item-container" key={i}>
                      <div className="item-img-container">
                        <img
                          src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/${item.itemImage}`}
                          alt={item.name}
                        />
                      </div>
                      <div className="item-details">
                        <p id="item-name">
                          {item.name.length >= 12
                            ? `${item.name.slice(0, 12)}...`
                            : item.name}
                        </p>
                        <p id="item-price">
                          Qty: ₹{item.price / 100} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}

            {/* <div className="my-order-footer">
                <button onClick={() => setActiveOrder(order._id)}>
                  View Details
                </button>

                <Modal
                  size="lg"
                  centered
                  show={activeOrder === order._id}
                  onHide={() => setActiveOrder(null)}
                >
                  <Modal.Body>
                    <div className="order-detail-modal-container">
                      <div className="order-details-modal-header">
                        <p>Order Details</p>
                        <RxCross2 onClick={() => setActiveOrder(null)} style={{cursor:"pointer"}}/>
                      </div>
                      <div className="order-details-modal">
                        <p id="order">ID : #{order._id.slice(0, 6)}</p>
                        <p id="date">Date : {order.createdAt.slice(0, 10)}</p>
                        <p>
                          Status: {order.orderStatus.replace(/_/g, " ")}
                        </p>
                        <p id="rest-name">
                          Restaurant : {order.restaurant.name},{" "}
                          {order.restaurant.restAddress}
                        </p>
                        <p id="rest-address">
                          Deliver to : {order.deliveryAddress.text}
                        </p>
                        <p>Total Items: {order.items.length}</p>
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
              </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};
