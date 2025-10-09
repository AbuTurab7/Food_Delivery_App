import "./restaurantFooter.css";
import { SiSwiggy } from "react-icons/si";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useState } from "react";

export default function RestaurantFooter() {

  const [isDown , setDown]=useState(false);
  
  return (
    <div className="restaurant_footer_container">
      <div className="restaurant-footer-inside-container">
        <div className="restaurant-footer-Download-details">
          <p
            style={{
              color: "#02060CBF",
              fontSize: "20px",
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
                height={"64px"}
                width={"201px"}
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
                height={"64px"}
                width={"186px"}
                src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/app_store.png"
                alt="Apple"
              />
            </a>
          </div>
        </div>
        <div className="restaurant-footer-details-container">
          <div className="restaurant-footer-details-logo">
            <div className="logoAndName">
              <div className="logo-container">
                <SiSwiggy />
              </div>
              <p
                style={{
                  color: "orangered",
                  fontSize: "28px",
                  fontWeight: "700",
                }}
              >
                Swiggy
              </p>
            </div>
            <p style={{ color: "#02060C99" }}>© 2025 Swiggy Limited</p>
          </div>
          <div className="restaurant-footer-details-company">
            <ul>
              <p>Company</p>
              <li>About Us</li>
              <li>Swiggy Corporate</li>
              <li>Team</li>
              <li>Swiggy One</li>
              <li>Swiggy Instamart</li>
              <li>Swiggy Dineout</li>
              <li>Swiggy Genie</li>
              <li>Minis</li>
              <li>Pyng</li>
            </ul>
          </div>
          <div className="restaurant-footer-details-contact">
            <div className="contact">
              <ul>
                <p>Contact us</p>
                <li>Help & Support</li>
                <li>Partner with us</li>
                <li>Ride with us</li>
              </ul>
            </div>
            <div className="legal">
              <ul>
                <p>Legal</p>
                <li>Terms & Conditions</li>
                <li>Cookie Policy</li>
                <li>Privacy Policy</li>
                <li>Investor Relations</li>
              </ul>
            </div>
          </div>
          <div className="restaurant-footer-details-available">
            <ul>
              <p>Available in:</p>
              <li>Bangalore</li>
              <li>Gurgaon</li>
              <li>Hyderabad</li>
              <li>Delhi</li>
              <li>Mumbai</li>
              <li>Pune</li>
              <li>
                <div className="citiesDropdown" onClick={()=>setDown(!isDown)}>679 cities <RiArrowDropDownLine className={isDown && "down"}/></div>
              </li>
            </ul>
          </div>
          <div className="restaurant-footer-details-life ">
            <div className="life">
              <ul>
              <p>Life at Swiggy</p>
              <li>Explore with Swiggy</li>
              <li>Swiggy News</li>
              <li>Snackables</li>
            </ul>
            </div>
            <div className="links">
              <ul>
              <p>Social Links</p>
              <li><div className="logos">
                <img src="https://media-assets.swiggy.com/h_32/portal/m/seo/icon-linkedin.png" alt="" height={"17px"} width={"17px"}/>
                <img src="https://media-assets.swiggy.com/h_32/portal/m/seo/icon-instagram.png" alt="" height={"17px"} width={"17px"}/>
                <img src="https://media-assets.swiggy.com/h_32/portal/m/seo/icon-facebook.png" alt="" height={"15px"} width={"13px"}/>
                <img src="https://media-assets.swiggy.com/h_32/portal/m/seo/icon-pinterest.png" alt=""height={"15px"} width={"17px"} />
                <img src="https://media-assets.swiggy.com/h_32/portal/m/seo/icon-twitter.png" alt="" height={"15px"} width={"17px"} />
                </div></li>
            </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
