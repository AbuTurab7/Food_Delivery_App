import { FaRegTrashCan } from "react-icons/fa6";
import "./cart.css";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { deleteItem, clearCart } from "../Utilities/cartSlice";
import { addUser } from "../Utilities/authSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config/firebaseAuth";
import toast from "react-hot-toast";

export default function CartPage() {
  const cart = useSelector((state) => state.cartSlice.cartItems);
  const restInfo = useSelector((state) => state.cartSlice.restInfo);
  const userData = useSelector((state) => state.authSlice.userData);
  const dispatch = useDispatch();

  let totalPay = 0;

  for (let i = 0; i < cart.length; i++) {
    totalPay = totalPay + (cart[i]?.defaultPrice || cart[i]?.price) / 100;
  }

  let gst = totalPay * 0.18;
  let toPay = gst + totalPay + 40;

  const VEG =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Veg_symbol.svg/180px-Veg_symbol.svg.png?20131205102827";
  const NON_VEG =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Non_veg_symbol.svg/180px-Non_veg_symbol.svg.png?20131205102929";

  function handleRemoveCart(idx) {

    if (cart.length > 1) {
      const updatedCart = [...cart];
      updatedCart.splice(idx, 1);
      dispatch(deleteItem(updatedCart));
      toast(() => (
        <span style={{ display: "flex", gap: "5px" }}>
          <FaRegTrashCan style={{ color: "red" }} />
          <p>Item Removed</p>
        </span>
      ));
    } else {
      handleClearCart();
    }
  }

  function handleClearCart() {
    dispatch(clearCart());
  }

  async function handleAuth() {
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success("Sign In succesfully");
      const userName = result?.user?.displayName;
      dispatch(addUser(userName));
    } catch (error) {
      console.error("Google sign-in error:", error.code, error.message);
      alert("Login failed: " + error.message);
    }
  }
  function handleOrder() {
    toast.success("Order Placed , Thank You!");
    handleClearCart();
  }
  if (cart.length <= 0) {
    return (
      <div className="empty-cart-main-container">
        <div className="cart-image-container"></div>
        <p style={{ color: "#02060CCC", fontSize: "20px" }}>
          Your cart is empty
        </p>
        <p style={{ color: "#02060C99", fontSize: "14px" }}>
          You can go to home page to view more restaurants
        </p>
        <Link to={"/"} style={{ textDecoration: "none" }}>
          <div className="see-restaurant-near-me">See restaurants near you</div>
        </Link>
      </div>
    );
  } else {
    return (
      <div className="cart-main-container">
        <div className="cart-rest-details-container">
          <img
            style={{ objectFit: "contain" }}
            width={"75px"}
            height={"75px"}
            src={`https://media-assets.swiggy.com/swiggy/image/upload/${restInfo.cloudinaryImageId}`}
          ></img>
          <span className="cart-rest-detail">
            <p style={{ color: "#02060C", fontSize: "18px" }}>
              {restInfo.name}
            </p>
            <p style={{ color: "#02060CB3", fontSize: "13px" }}>
              {restInfo.city}
            </p>
          </span>
        </div>

        {cart?.map((item, i) => (
          <div className="cart-item-container" key={i}>
            <div className="cart-details-container">
              <div className="cart-item-name">
                <img
                  height={"15px"}
                  width={"15px"}
                  src={
                    item?.itemAttribute?.vegClassifier === "VEG" ? VEG : NON_VEG
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
                </p>
                <button id="cart-item-btn" onClick={() => handleRemoveCart(i)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="cart-clear-btn-container">
          <button id="cart-item-btn" onClick={handleClearCart}>
            Clear
          </button>
        </div>
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
        <div className="orderBtnContainer">
          {userData ? (
            <button id="orderBtn" onClick={handleOrder}>
              Place Order
            </button>
          ) : (
            <button id="Sign-in-Btn" onClick={handleAuth}>
              Sign in to place order
            </button>
          )}
        </div>
      </div>
    );
  }
}
