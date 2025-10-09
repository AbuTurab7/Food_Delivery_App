import Cards from "./Cards";
import Filter from "./Filter";
import "./dishes.css";
import { useSelector } from "react-redux";

export default function RestaurantsList({ restaurants }) {
  const filterVal = useSelector((state) => state.filterSlice?.filterVal);


  const filteredData =
    restaurants[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants.filter(
      (item) => {
        if (!filterVal) return true;

        switch (filterVal) {
          case "Ratings 4.0+":
            return item?.info?.avgRating > 4;
          case "Rs. 300-Rs. 600":
            return (
              item?.info?.costForTwo?.slice(1, 4) >= "300" &&
              item?.info?.costForTwo?.slice(1, 4) <= "600"
            );
          case "Offers":
            return item?.info?.aggregatedDiscountInfoV3?.header;
          case "Less than Rs. 300":
            return item?.info?.costForTwo?.slice(1, 4) < "300";
          default:
            return true;
        }
      }
    );

  return (
    <div>
      <div className="restaurants-list-container" style={{ marginTop: "30px" }}>
        <div className="restaurants-list-heading">
          <p style={{ fontSize: "22px", color: "black", fontWeight: "650" }}>
            {restaurants[2]?.card?.card?.title}
          </p>
        </div>
        <div className="restaurants-list-filter">
          <Filter FilterData={restaurants[3]?.card?.card} />
        </div>
        <div className="restaurants-list-cards">
          <Cards
            data={
              filterVal
                ? filteredData
                : restaurants[4]?.card?.card?.gridElements?.infoWithStyle
                    ?.restaurants
            }
          />
        </div>
      </div>
    </div>
  );
}
