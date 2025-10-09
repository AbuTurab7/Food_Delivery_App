import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { MdStars, MdLocationPin } from "react-icons/md";
import { LuDot } from "react-icons/lu";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import "./restaurant.css";
import ModalComponent from "./ModalComponent";
import Menu from "./Menu";
import { RestShimmer } from "./Shimmer";
import { Coordinates } from "./ContextApi";

export default function Restaurant() {
  const id = useParams();
  const mainId = id.id.split("-").at(-1).split("rest").at(-1);
  const {
    coords: { lat, lng },
  } = useContext(Coordinates);

  const [restaurantInfo, setRestaurantInfo] = useState([]);
  const [dealsSlide, setDealsSlide] = useState([]);
  const [menu, setMenu] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [value, setValue] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const handleResize = () => setShow(window.innerWidth >= 1200);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handlePrev() {
    value >= 45 ? "" : setValue((prev) => prev + 45);
  }

  function handleNext() {
    value <= -45 ? "" : setValue((prev) => prev - 45);
  }

  async function fetchMenu() {
    try {
      const res = await fetch(
        `https://swiggy-netfily-proxy.netlify.app/.netlify/functions/swiggy?type=menu&lat=${lat}&lng=${lng}&id=${mainId}`
      );
      const result = await res.json();
      setRestaurantInfo(result?.data?.cards[2]?.card?.card?.info);
      setDealsSlide(
        result?.data?.cards[3]?.card?.card?.gridElements?.infoWithStyle?.offers
      );
      setMenu(
        result?.data?.cards[5]?.groupedCard?.cardGroupMap?.REGULAR?.cards
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <>
      {!restaurantInfo.id ? (
        <RestShimmer />
      ) : (
        <div className="restaurant-main-container">
          <div className="restuarant-header">
            <p style={{ color: "#02060CCC", fontSize: "10px" }}>
              <Link to={"/"} id="home">
                <span>Home</span>
              </Link>{" "}
              /{" "}
              <Link to={"/"} id="home">
                <span>{restaurantInfo?.locality}</span>
              </Link>{" "}
              / {restaurantInfo?.name}
            </p>
          </div>

          {/* Restaurant Info Card */}
          <div className="restuarant-card-container">
            <p id="name">{restaurantInfo?.name}</p>
            <div className="restuarant-card">
              <div className="restaurant-card-inside">
                <p id="restaurant-card-rating">
                  <MdStars /> {restaurantInfo?.avgRating} (
                  {restaurantInfo?.totalRatingsString}) <LuDot />{" "}
                  {restaurantInfo?.costForTwoMessage}
                </p>
                <p style={{ color: "#ff5200", textDecoration: "underline" }}>
                  {restaurantInfo?.cuisines?.join(", ")}
                </p>
                <div className="restaurant-card-route-container">
                  <div className="route-container">
                    <div className="route-circle"></div>
                    <div className="route-line"></div>
                    <div className="route-circle"></div>
                  </div>
                  <div className="route-details">
                    <p>
                      Outlet{" "}
                      <span id="route-details-locality">
                        {restaurantInfo?.areaName}
                      </span>
                    </p>
                    <p>{restaurantInfo?.sla?.slaString?.toLowerCase()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deals Slider */}
          {show && (
            <div className="deals-slider-container">
              <div className="Dishes-Container" style={{ marginTop: "35px" }}>
                <div
                  className="restaurantSlide-inside-container"
                  style={{ width: "100%" }}
                >
                  <div className="dishes-header">
                    <div className="heading-container">
                      <p
                        style={{
                          fontSize: "20px",
                          color: "black",
                          fontWeight: "650",
                          marginLeft: "15px",
                        }}
                      >
                        Deals for you
                      </p>
                    </div>
                    <div className="dishes-arrow-container">
                      <IoIosArrowRoundBack
                        onClick={handlePrev}
                        className={value >= 45 ? "disabled" : ""}
                      />
                      <IoIosArrowRoundForward
                        onClick={handleNext}
                        className={value <= -45 ? "disabled" : ""}
                      />
                    </div>
                  </div>

                  <div
                    className="restaurantSlide-card-container"
                    style={{ transform: `translateX(${value}%)` }}
                  >
                    {dealsSlide?.map((deal, i) => (
                      <div
                        key={i}
                        className="deal-card"
                        onClick={() => {
                          setSelectedDeal(deal);
                          setModalShow(true);
                        }}
                      >
                        <div className="deal-card-img-container">
                          <img
                            height={"48px"}
                            width={"48px"}
                            src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_96,h_96/${deal?.info?.offerLogo}`}
                            alt="logo"
                          />
                        </div>
                        <div className="deal-card-details-container">
                          <p style={{ color: "#02060CEB", fontSize: "18px" }}>
                            {deal?.info?.header}
                          </p>
                          <p style={{ color: "#02060C73", fontSize: "12px" }}>
                            {deal?.info?.description}
                          </p>
                        </div>
                      </div>
                    ))}
                    <ModalComponent
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                      deal={selectedDeal}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Menu */}
          <div className="restaurant-menu-main-container">
            <Menu menu={menu} restInfo={restaurantInfo} />
          </div>

          {/* Footer */}
          <div className="restaurant-footer">
            <div className="footer-logo">
              <img
                height={"30px"}
                width={"60px"}
                src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_120,h_60/fssai_final_edss9i"
                alt="FSSAI"
              />
              <p
                style={{
                  color: "#02060C80",
                  fontSize: "13px",
                  marginTop: "5px",
                }}
              >
                License No. 11424210000145
              </p>
            </div>
            <hr />
            <div className="footer-details-container">
              <div className="footer-details">
                <p style={{ color: "#02060C80", fontSize: "16px" }}>
                  {restaurantInfo?.name}
                </p>
                <p style={{ color: "#02060C80", fontSize: "13px" }}>
                  (Outlet:{restaurantInfo?.areaName})
                </p>
              </div>
              <div className="footer-address">
                {restaurantInfo?.labels?.length > 1 && (
                  <p style={{ color: "#02060C66", fontSize: "11px" }}>
                    <MdLocationPin />
                    {restaurantInfo?.labels[1]?.message}
                  </p>
                )}
              </div>
            </div>
            <hr />
            <div className="footer-Download-details">
              <p
                style={{
                  color: "#02060CEB",
                  fontSize: "14px",
                  fontWeight: "700",
                }}
              >
                For better experience, download the Swiggy app now
              </p>
              <div className="GoogleApple-container">
                <a
                  style={{ marginRight: "30px" }}
                  href="https://play.google.com/store/apps/details?id=in.swiggy.android&referrer=utm_source%3Dswiggy%26utm_medium%3Dheader"
                  target="blank"
                  className="google-play"
                >
                  <img
                    height={"48px"}
                    width={"150px"}
                    src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/play_store.png"
                    alt="Google"
                  />
                </a>
                <a
                  href="https://apps.apple.com/in/app/swiggy-food-instamart-dineout/id989540920"
                  target="blank"
                  className="apple-store"
                >
                  <img
                    height={"48px"}
                    width={"150px"}
                    src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/app_store.png"
                    alt="Apple"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
