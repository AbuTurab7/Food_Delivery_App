import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import "./myOrders.css";
import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { serverURL } from "./Home";
import { setOrderStatus } from "../Utilities/authSlice";

export const MyOrders = () => {
  const userData = useSelector((state) => state.authSlice.userData);
  const myOrders = useSelector((state) => state.authSlice.myOrders);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const handleOrderStatus = async ({ orderId, status }) => {
    setError(null);
    try {
      const res = await fetch(`${serverURL}/api/update-orders-status/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      }

      dispatch(setOrderStatus({ orderId, status }));
    } catch (error) {
      console.error("Error in updating status:", error);
      setError("There's an issue in updating status");
    }
  };

  return (
    <div className="my-orders-main-container">
      <div className="my-orders-container">
        <h4>My Orders</h4>
        {error && <p className="error-msg">{error}</p>}

        {myOrders.length === 0 ? (
          <div className="no-orders">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="No orders"
            />
            <h3>No orders yet</h3>
            <p>Looks like you haven’t placed any orders yet.</p>
            <Link to="/">
              <button className="order-now-btn">Order Now</button>
            </Link>
          </div>
        ) : (
          myOrders.map((order, idx) => (
            <div className="my-order-container" key={idx}>
              <div className="my-order-header">
                <div className="my-order-header-left">
                  <p id="order">Order #{order._id.slice(0, 6)}</p>
                  <p id="date">{order.createdAt.slice(0, 10)}</p>
                </div>

                <div className="my-order-header-right">
                  <p id="pay-mode">{order.paymentMode}</p>

                  {userData.role === "owner" ? (
                    <DropdownButton
                      id="dropdown-basic-button"
                      title={order.orderStatus.replace(/_/g, " ")}
                      className={`custom-dropdown ${order.orderStatus}`}
                    >
                      <Dropdown.Item
                        onClick={() =>
                          handleOrderStatus({
                            orderId: order._id,
                            status: "pending",
                          })
                        }
                      >
                        pending
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handleOrderStatus({
                            orderId: order._id,
                            status: "preparing",
                          })
                        }
                      >
                        preparing
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handleOrderStatus({
                            orderId: order._id,
                            status: "out_for_delivery",
                          })
                        }
                      >
                        out for delivery
                      </Dropdown.Item>
                    </DropdownButton>
                  ) : (
                    <p
                      id="order-status"
                      className={order.orderStatus}
                    >
                      {order.orderStatus.replace(/_/g, " ")}
                    </p>
                  )}
                </div>
              </div>

              <div className="my-order-body">
                <div className="my-order-body-upper">
                  <p id="rest-name">{order.restaurant.name}</p>
                  <p id="rest-address">{order.restaurant.restAddress}</p>
                </div>

                <div className="my-order-body-lower">
                  {order.items.map((item, i) => (
                    <div className="item-container" key={i}>
                      <div className="item-img-container">
                        <img
                          src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/${item.itemImage}`}
                          alt=""
                        />
                      </div>
                      <div className="item-details">
                        <p id="item-name">
                          {item.name.length >= 12
                            ? `${item?.name.slice(0, 12)}...`
                            : item?.name}
                        </p>
                        <p id="item-price">
                          Qty : ₹{item.price / 100}x{item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="my-order-footer">
                <button>Track order</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
