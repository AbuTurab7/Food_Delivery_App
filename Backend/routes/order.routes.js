import { Router } from "express";
import { getMyOrders, postPlaceOrder, postUpdateOrderStatus, postVerifyPayment } from "../controller/order.controller.js";
import { verifyAuthentication } from "../middleware/verify-auth-middleware.js";


const orderRouter = Router();

orderRouter.route("/place-order").post(verifyAuthentication , postPlaceOrder);
orderRouter.route("/order/verify-payment").post(verifyAuthentication , postVerifyPayment);
orderRouter.route("/get-my-orders").get(verifyAuthentication ,getMyOrders);
orderRouter.route("/update-orders-status/:orderId").post(verifyAuthentication ,postUpdateOrderStatus);
export default orderRouter;     