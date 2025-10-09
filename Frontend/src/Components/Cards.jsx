import "./dishes.css";
import { LuDot } from "react-icons/lu";
import { MdStars } from "react-icons/md";
import { useNavigate } from "react-router";

export default function Cards({ data }) {
  const navigate = useNavigate();
  return (
    <>
        {data?.map(
          (restaurant , index) => (
            <div key={index} className="restaurantSlide-card" onClick={() => navigate(`/restaurant/${restaurant?.cta?.link.split("/").slice(-3)}`)}>
              <div className="restaurantSlide-img-container">
                <img
                  width={"273px"}
                  height={"182px"}
                  src={`https://media-assets.swiggy.com/swiggy/image/upload/${restaurant?.info?.cloudinaryImageId}`}
                ></img>
                <div className="gradient-container"></div>
                <p id="discont-tag">
                  {restaurant?.info?.aggregatedDiscountInfoV3?.header &&
                  restaurant?.info?.aggregatedDiscountInfoV3?.subHeader
                    ? `${restaurant?.info?.aggregatedDiscountInfoV3?.header} ${restaurant?.info?.aggregatedDiscountInfoV3?.subHeader}`
                    : ""}
                </p>
              </div>
              <div className="restaurantSlide-details-container">
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "black",
                  }}
                >
                  {restaurant?.info?.name}
                </p>
                <p id="rating">
                  <MdStars style={{ color: "green" }} />{" "}
                  {restaurant?.info?.avgRating}
                  <LuDot />
                  {restaurant?.info?.sla?.slaString}
                </p>
                <div className="cuisines-container">
                  <p>{restaurant?.info?.cuisines?.join(", ")}</p>
                </div>
                <p>{restaurant?.info?.areaName}</p>
              </div>
            </div>
          )
        )}
    </>
  );
}
