import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import "./myOrders.css";
import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { serverURL } from "./Home";
import {
  addToMyOrders,
  setDeliveryBoy,
  setOrderStatus,
  updateOrder,
} from "../Utilities/authSlice";
import toast from "react-hot-toast";

export const MyOrders = () => {
  const userData = useSelector((state) => state.authSlice.userData);
  const myOrders = useSelector((state) => state.authSlice.myOrders);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState("");

  const getDeliveryBoys = async () => {
    setError(null);
    try {
      const res = await fetch(`${serverURL}/api/all-delivery-boys`, {
        method: "GET",
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.message);
        return;
      }
      console.log(result);
      setDeliveryBoys(result);
    } catch (error) {
      console.error("Error in getting delivery boys:", error);
      setError("There's an issue in getting delivery boys");
    }
  };

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
    } catch (error) {
      console.error("Error in updating status:", error);
      setError("There's an issue in updating status");
    }
  };

  const handleAssign = async ({ isAllowed, orderId }) => {
    setError(null);
    if (!isAllowed) {
      setError("No delivery boy is selected!");
      return;
    }
    try {
      const res = await fetch(
        `${serverURL}/api/${orderId}/assign-delivery-boy`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deliveryBoyId: selectedDeliveryBoy._id }),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      }
      dispatch(updateOrder(data.order));
      toast.success(data.message);
    } catch (error) {
      console.error("Error in assigning deliver boy :", error);
      setError("There's an issue in assigning deliver boy");
    }
  };
  console.log(deliveryBoys);
  useEffect(() => {
    getDeliveryBoys();
  }, []);

  return (
    <div className="my-orders-main-container">
      <div className="my-orders-container">
        <h4>My Orders</h4>
        {error && <p className="error-msg">{error}</p>}

        {myOrders?.length === 0 ? (
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
          myOrders?.map((order, idx) => (
            <div className="my-order-container" key={idx}>
              <div className="my-order-header">
                <div className="my-order-header-left">
                  <p id="order">Order #{order._id.slice(0, 6)}</p>
                  <p id="date">{order.createdAt.slice(0, 10)}</p>
                </div>

                <div className="my-order-header-right">
                  <p id="pay-mode">{order.paymentMode}</p>

                  {userData.role === "owner" && order.deliveryBoy !== null ? (
                    <p>{order?.deliveryBoy?.fullname}</p>
                  ) : userData.role === "owner" &&
                    order.orderStatus === "Out_for_delivery" ? (
                    <div>
                      {deliveryBoys.length === 0 ? (
                        <p>No delivery boy available</p>
                      ) : (
                        <DropdownButton
                          id="dropdown-basic-button"
                          title={
                            order?.deliveryBoy?.fullname ||
                            "Select a delivery boy"
                          }
                          className="custom-dropdown"
                        >
                          {deliveryBoys.map((boy) => (
                            <Dropdown.Item
                              key={boy._id}
                              onClick={() => {
                                setSelectedDeliveryBoy(boy);
                                dispatch(
                                  setDeliveryBoy({
                                    orderId: order._id,
                                    deliveryBoy: boy,
                                  })
                                );
                              }}
                            >
                              {boy.fullname}
                            </Dropdown.Item>
                          ))}
                        </DropdownButton>
                      )}
                    </div>
                  ) : userData.role === "owner" ? (
                    <DropdownButton
                      id="dropdown-basic-button"
                      title={order.orderStatus.replace(/_/g, " ")}
                      className={`custom-dropdown ${order.orderStatus}`}
                    >
                      <Dropdown.Item
                        onClick={() =>
                          handleOrderStatus({
                            orderId: order._id,
                            status: "Pending",
                          })
                        }
                      >
                        Pending
                      </Dropdown.Item>

                      <Dropdown.Item
                        onClick={() =>
                          handleOrderStatus({
                            orderId: order._id,
                            status: "Preparing",
                          })
                        }
                      >
                        Preparing
                      </Dropdown.Item>

                      <Dropdown.Item
                        onClick={() => {
                          handleOrderStatus({
                            orderId: order._id,
                            status: "Out_for_delivery",
                          });
                        }}
                      >
                        Assign to delivery boy
                      </Dropdown.Item>
                    </DropdownButton>
                  ) : (
                    <p id="order-status" className={order.orderStatus}>
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
                {userData.role === "user" ? (
                  <button>Track order</button>
                ) : 
                order?.assignedAt ? (
                  <button>Track order</button>
                ) : (
                  <button
                    onClick={() =>
                      handleAssign({
                        isAllowed: order?.deliveryBoy?.fullname,
                        orderId: order._id,
                      })
                    }
                  >
                    Assign To Delivery Partner{" "}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
