import NavBar from "./NavBar";
import Body from "./Body";
import Restaurant from "./Restaurant";
import CartPage from "./CartPage";
import "./Home.css";
import { Routes, Route } from "react-router";
import { useState } from "react";
import { Coordinates } from "./ContextApi";

export const serverURL = "http://localhost:3000";
export default function Home() {
  
  const [coords, setCoords] = useState(() => ({
    lat: 26.7617171 ,
    lng: 80.88564749999999,
  }));

  return (
    <Coordinates.Provider value={{ coords, setCoords }}>
      <NavBar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Body />} />
          <Route path="/restaurant/:id" element={<Restaurant />} />
          <Route path="/restaurant/cart" element={<CartPage />} />
          <Route path="*" element={<h1>Coming Soon...</h1>} />
        </Routes>
      </div>
    </Coordinates.Provider>
  );
}
