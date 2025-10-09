import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { useState, useEffect } from "react";
import Cards from "./Cards";
import "./dishes.css";

export default function RestaurantSlide({ data, restaurants }) {
  const [value, setValue] = useState(0); 
  const [show, setShow] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setShow(window.innerWidth >= 1200);
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handlePrev() {
    value >= 0 ? "" : setValue((prev) => prev + 92);
  }

  function handleNext() {
    value <= -92 ? "" : setValue((prev) => prev - 92); 
  }

  if (!show) return null; 

  return (
    <div className="Dishes-Container" style={{ marginTop: "35px" }}>
      <div className="restaurantSlide-inside-container">
        <div className="dishes-header">
          <div className="heading-container">
            <p style={{ fontSize: "20px", color: "black", fontWeight: "650" }}>
              {data?.header?.title}
            </p>
          </div>
          <div className="dishes-arrow-container">
            <IoIosArrowRoundBack
              onClick={handlePrev}
              className={value >= 0 ? "disabled" : ""}
            />
            <IoIosArrowRoundForward
              onClick={handleNext}
              className={value <= -92 ? "disabled" : ""}
            />
          </div>
        </div>
        <div
          className="restaurantSlide-card-container"
          style={{ transform: `translateX(${value}%)` }}
        >
          <Cards 
            data={restaurants[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants}
          />
        </div>
      </div>
      <hr />
    </div>
  );
}
