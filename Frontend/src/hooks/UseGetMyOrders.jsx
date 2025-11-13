import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { serverURL } from "../Components/Home";
import { setMyOrders } from "../Utilities/authSlice";

export const UseGetMyOrders = () => {
  const userData = useSelector((state) => state.authSlice.userData);
  // const orderData = useSelector((state) => state.authSlice.myOrders);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${serverURL}/api/get-my-orders`, {
          credentials: "include",
        });
        const result = await res.json();
        dispatch(setMyOrders(result));
        console.log(result);
        
      } catch (error) {
        console.log("Error in fetch orders : ", error);
      }
    };
    fetchOrders();
  }, [userData]);
};
