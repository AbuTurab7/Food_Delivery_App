import { FaCheckCircle } from "react-icons/fa";
import "./orderPlaced.css"
import { Link, useNavigate } from "react-router";
export const OrderPlaced = () => {
    const navigate = useNavigate();
    return (
        <div className="order-placed-main-container">
            <div className="order-placed-container">
                <FaCheckCircle />
                <p id="order-placed-header">Order Placed!</p>
                <p id="order-placed-para">Thank you for your purchase. Your Order is being prepared. You can track your order status in "My Orders" section.</p>
                <button id="order-placed-btn" onClick={() => navigate("/my-orders")}>Back to my orders</button>
            </div>
        </div>
    );
}