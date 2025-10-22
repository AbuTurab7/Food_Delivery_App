import { useSelector } from "react-redux";
import { Link } from "react-router"; // 👈 Make sure you import Link
import "./myOrders.css";

export const MyOrders = () => {
  const myOrders = useSelector((state) => state.authSlice.myOrders);
  console.log(myOrders);

  return (
    <div className="my-orders-main-container">
      <div className="my-orders-container">
        <h4>My Orders</h4>

        {/* ✅ Show message if no orders */}
        {myOrders.length === 0 ? (
          <div className="no-orders">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="No orders"
            />
            <h3>No orders yet</h3>
            <p>Looks like you haven’t placed any orders yet.</p>

            {/* 👇 Order Now button */}
            <Link to="/">
              <button className="order-now-btn">Order Now</button>
            </Link>
          </div>
        ) : (
          myOrders.map((order, idx) => (
            <div className="my-order-container" key={idx}>
              <div className="my-order-header">
                <div className="my-order-header-left">
                  <p id="order">Order #{order._id.slice(0, 6)}</p>
                  <p id="date">{order.createdAt.slice(0, 10)}</p>
                </div>
                <div className="my-order-header-right">
                  <p id="pay-mode">{order.paymentMode}</p>
                  <p id="order-status">{order.orderStatus}</p>
                </div>
              </div>

              <div className="my-order-body">
                <div className="my-order-body-upper">
                  <p id="rest-name">{order.restaurant.name}</p>
                  <p id="rest-address">{order.restaurant.restAddress}</p>
                </div>

                <div className="my-order-body-lower">
                  {order.items.map((item, i) => (
                    <div className="item-container" key={i}>
                      <div className="item-img-container">
                        <img
                          src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/${item.itemImage}`}
                          alt=""
                        />
                      </div>
                      <div className="item-details">
                        <p id="item-name">
                          {item.name.length >= 12
                            ? `${item?.name.slice(0, 12)}...`
                            : item?.name}
                        </p>
                        <p id="item-price">
                          Qty : ₹{item.price / 100}x{item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="my-order-footer">
                <button>Track order</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
