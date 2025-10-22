import NavBar from "./NavBar";
import Body from "./Body";
import Restaurant from "./Restaurant";
import CartPage from "./CartPage";
import "./Home.css";
import { Routes, Route } from "react-router";
import { useState } from "react";
import { Coordinates } from "./ContextApi";
import { UseGetCurrentUser } from "../hooks/useGetCurrentUser";
import { useSelector } from "react-redux";
import { DeliveryBoy } from "./DeliveryBoy";
import { OwnerDashboard } from "./OwnerDashboard";
import { CheckOutPage } from "./CheckOutPage";
import { OrderPlaced } from "./OrderPlaced";
import { MyOrders } from "./MyOrders";
import { UseGetMyOrders } from "../hooks/UseGetMyOrders";

export const serverURL = "http://localhost:3000";
export default function Home() {
  const [coords, setCoords] = useState(() => ({
    lat: 26.7617171,
    lng: 80.88564749999999,
  }));
  UseGetCurrentUser();
  UseGetMyOrders();

  const userData = useSelector((state) => state.authSlice.userData);
  // console.log(userData);

  const getDashBoard = () => {
     if (userData?.role === "owner") {
    return <Route path="/" element={<OwnerDashboard />} />;
  } else if (userData?.role === "deliveryBoy") {
   return <Route path="/" element={<DeliveryBoy />} />;
  } else {
    return (
      <>
      <Route path="/" element={<Body />} />
      <Route path="/restaurant/:id" element={<Restaurant />} />
      <Route path="/restaurant/cart" element={<CartPage />} />
      <Route path="/restaurant/cart/checkout" element={<CheckOutPage />} />
      <Route path="/order-placed" element={<OrderPlaced />} />
      <Route path="/my-orders" element={<MyOrders />} />
    </>
    );
    
  }
  }

  return (
    <Coordinates.Provider value={{ coords, setCoords }}>
      <NavBar />
      <div className="main-content">
        <Routes>
          {getDashBoard()}
          {/* {
            <Route path="/" element={<Body />} />
          <Route path="/restaurant/:id" element={<Restaurant />} />
          <Route path="/restaurant/cart" element={<CartPage />} />
          } */}
          
          <Route path="*" element={<h1>Coming Soon...</h1>} />
        </Routes>
      </div>
    </Coordinates.Provider>
  );
}
