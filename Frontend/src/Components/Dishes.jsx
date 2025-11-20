import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { useState, useEffect } from "react";
import "./dishes.css";

export default function Dishes({ images }) {
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
    value >= 0 ? "" : setValue((prev) => prev + 40);
  }

  function handleNext() {
    value <= -60 ? "" : setValue((prev) => prev - 40);
  }

  if (!show) return null; 

  return (
    <div className="Dishes-Container">
      <div className="dishes-inside-container">
        <div className="dishes-header">
          <div className="heading-container">
            <p style={{ fontSize: "21px" }}>What's on your mind?</p>
          </div>
          <div className="dishes-arrow-container">
            <IoIosArrowRoundBack
              onClick={handlePrev}
              className={value >= 0 ? "disabled" : ""}
            />
            <IoIosArrowRoundForward
              onClick={handleNext}
              className={value <= -60 ? "disabled" : ""}
            />
          </div>
        </div>
        <div
          className="dishes-img-container"
          style={{ transform: `translateX(${value}%)` }}
        >
          {images?.map((img, index) => (
            <img
              key={index}
              width={"150px"}
              height={"185px"}
              src={`https://media-assets.swiggy.com/swiggy/image/upload/${img.imageId}`}
              alt="dish"
            />
          ))}
        </div>
      </div>
      <hr />
    </div>
  );
}
