import "./cart.css";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { MdLocationOn, MdOutlineMyLocation } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { BsCashCoin } from "react-icons/bs";
import { FaMobileAlt } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa6";
import { UseGetCurrentUserLocation } from "../hooks/UseGetCurrentUserLocation";
import { TileLayer, MapContainer, Marker, Popup, useMap } from "react-leaflet";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";

import "leaflet/dist/leaflet.css";
import "./checkoutPage.css";
import marker from "../assets/marker.png";
import { setAddress, setLocation } from "../Utilities/mapSlice";
import { serverURL } from "./Home";
import { clearCart } from "../Utilities/cartSlice";
import { addToMyOrders } from "../Utilities/authSlice";

const markerIcon = new L.Icon({
  iconUrl: marker,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

export function CheckOutPage() {
  const [paymentMode, setPaymentMode] = useState("COD");
  const [error, setError] = useState(null);
  const cart = useSelector((state) => state.cartSlice.cartItems);
  const restInfo = useSelector((state) => state.cartSlice.restInfo);
  const userData = useSelector((state) => state.authSlice.userData);
  const dispatch = useDispatch();
  const { getUserCoordinates } = UseGetCurrentUserLocation();
  const { location, address } = useSelector((state) => state.mapSlice);
  const position = [location.lat, location.lon];
  const navigate = useNavigate();

  let totalPay = 0;

  for (let i = 0; i < cart.length; i++) {
    totalPay =
      totalPay +
      ((cart[i]?.defaultPrice || cart[i]?.price) / 100) * cart[i].quantity;
  }

  let gst = totalPay * 0.18;
  let toPay = gst + totalPay + 40;

  const VEG =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Veg_symbol.svg/180px-Veg_symbol.svg.png?20131205102827";
  const NON_VEG =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Non_veg_symbol.svg/180px-Non_veg_symbol.svg.png?20131205102929";

  function RecenterMap() {
    if (location.lat && location.lon) {
      const map = useMap();
      map.setView([location.lat, location.lon], 16, { animate: true });
    }
    return null;
  }

  const handleDragEnd = async (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat: lat, lon: lng }));
    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${
          import.meta.env.VITE_GEO_API_KEY
        }`
      );
      const result = await res.json();
      // console.log(result);

      const address = result?.results?.[0]?.formatted || "Unknown location";
      dispatch(setAddress(address));
    } catch (err) {
      console.error("Error fetching address:", err);
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setError(null);
    if (!address) {
      setError("Please enter delivery address");
      return;
    }
    if (cart.length === 0) {
      setError("Cart is empty");
      return;
    }

    const orderPayload = {
      userId: userData.userId,
      restaurant: {
        id: restInfo?.id,
        name: restInfo?.name,
        image: restInfo?.cloudinaryImageId,
        subHeader: restInfo?.aggregatedDiscountInfoV3?.subHeader,
        rating: restInfo?.avgRating,
        restAddress: restInfo?.areaName,
        cuisines: restInfo?.cuisines,
      },
      items: cart.map((item) => ({
        itemId: item.itemId,
        name: item.name,
        quantity: item.quantity,
        price: item?.defaultPrice || item?.price,
        itemImage: item.imageId,
      })),
      deliveryAddress: {
        text: address,
        lat: location.lat,
        lon: location.lon,
      },
      totalAmount: toPay,
      paymentMode,
    };

    // console.log("Order Payload:", orderPayload);

    try {
      const res = await fetch(`${serverURL}/api/place-order`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      }
    if(paymentMode === "COD"){
        dispatch(addToMyOrders(data.order));
      dispatch(clearCart());
      navigate("/order-placed");
    } else {
      const orderId = data.orderId;
      const razorOrder = data.razorOrder;
      openRazorPayWindow(orderId , razorOrder);
    }
    } catch (error) {
      console.error(`Error during placing order:`, error);
      setError(`There's a issue in placing order`);
    }
  };

  const openRazorPayWindow = (orderId , razorOrder) => {
    const options = {
      key: import.meta.env.VITE_RAZOR_KEY,
      amount: razorOrder.amount,
      currency: "INR",
      name : "FoodDeliveryApp",
      description: "Food Delivery Website",
      order_id: razorOrder.id,
      handler: async function (response) {
        try {
          const res = await fetch(`${serverURL}/api/order/verify-payment`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({razorpay_payment_id: response.razorpay_payment_id, orderId}),
            credentials: "include"
          })
          const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      }
      dispatch(addToMyOrders(data.order));
      dispatch(clearCart());
      navigate("/order-placed");
        } catch (error) {
          console.error(`Error during payment verification:`, error);
      setError(`There's a issue in verifying payment`);
        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open();
  }

  return (
    <div className="checkout-main-container">
      <div className="checkout-container">
        <h4>Checkout</h4>
        <div className="delivery-detail-container">
          <div className="delivery-detail-header-container">
            <MdLocationOn style={{ color: "orangered" }} />
            <p id="checkout-title">Delivery location</p>
          </div>
          <div className="delivery-input-container">
            <GeoapifyContext apiKey={import.meta.env.VITE_GEO_API_KEY}>
              <GeoapifyGeocoderAutocomplete
                placeholder="Enter your address..."
                value={address}
                placeSelect={(place) => {
                  dispatch(setAddress(place.properties.formatted));
                  dispatch(
                    setLocation({
                      lat: place.properties.lat,
                      lon: place.properties.lon,
                    })
                  );
                }}
              />
            </GeoapifyContext>
            <button id="search-btn">
              <IoSearchOutline />
            </button>
            <button id="current-location-btn" onClick={getUserCoordinates}>
              <MdOutlineMyLocation />
            </button>
          </div>
          <div className="delivery-map-container">
            <div className="delivery-map">
              {location.lat && location.lon ? (
                <MapContainer
                  center={position}
                  zoom={16}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <RecenterMap location={location} />
                  <Marker
                  icon={markerIcon}
                    position={position}
                    draggable
                    eventHandlers={{ dragend: handleDragEnd }}
                  >
                    <Popup>Your location</Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <p>Loading map...</p>
              )}
            </div>
          </div>
        </div>
        <p id="checkout-title" style={{ margin: "10px 0" }}>
          Payment Method
        </p>
        <div className="payment-container">
          <div
            className={
              paymentMode === "COD"
                ? "cod-pay-container active-pay"
                : "cod-pay-container"
            }
            onClick={() => setPaymentMode("COD")}
          >
            <div className="cod-pay-logo-container">
              <div className="cod-pay-logo">
                <BsCashCoin style={{ fontSize: "20px" }} />
              </div>
            </div>
            <div className="cod-pay-details">
              <p id="pay-main">Cash On Delivery</p>
              <p id="pay-secondary">Pay when your food arrives</p>
            </div>
          </div>
          <div
            className={
              paymentMode === "Online"
                ? "online-pay-container active-pay"
                : "online-pay-container"
            }
            onClick={() => setPaymentMode("Online")}
          >
            <div className="online-pay-logo-container">
              <div className="online-pay-logo" id="phone-logo">
                <FaMobileAlt />
              </div>
              <div className="online-pay-logo">
                <FaCreditCard />
              </div>
            </div>
            <div className="online-pay-details">
              <p id="pay-main">UPI/Credit/Debit Card</p>
              <p id="pay-secondary">Pay Online Securely</p>
            </div>
          </div>
        </div>
        <div className="order-summary-container">
          <p id="checkout-title" style={{ margin: "10px 0" }}>
            Order Summary
          </p>
          {cart?.map((item, i) => (
            <div className="cart-item-container" key={i}>
              <div className="cart-details-container">
                <div className="cart-item-name">
                  <img
                    height={"15px"}
                    width={"15px"}
                    src={
                      item?.itemAttribute?.vegClassifier === "VEG"
                        ? VEG
                        : NON_VEG
                    }
                    alt="logo"
                  />
                  <p style={{ fontSize: "14px", color: "#02060C" }}>
                    {item?.name}
                  </p>
                </div>
                <div className="cart-item-btn-container">
                  <p style={{ fontSize: "15px", color: "#02060CEB" }}>
                    {" "}
                    ₹{(item?.defaultPrice || item?.price) / 100}
                    <span id="item-quantity-first">x{item.quantity}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="cart-bill-container">
            <p style={{ paddingBottom: "10px" }}>Bill Details</p>
            <div className="item-total">
              <p>Item Total</p>
              <p>₹{totalPay}</p>
            </div>
            <div className="delivery-fee">
              <p>Delivery Fee</p>
              <p>₹40</p>
            </div>
            <div className="gst-charges">
              <p>GST & Other Charges</p>
              <p>₹{gst.toFixed(2)}</p>
            </div>
            <div className="to-pay">
              <p>TO PAY</p>
              <p>₹{toPay.toFixed(2)}</p>
            </div>
          </div>
          {error && <p className="error-msg">{error}</p>}
          <div className="orderBtnContainer">
              <button id="payment-btn" onClick={placeOrder}>
                {paymentMode === "COD" ? "Place order" : "Pay & place order"}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
