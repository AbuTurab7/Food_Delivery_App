import { Router } from "express";
import { verifyAuthentication } from "../middleware/verify-auth-middleware.js";
import { getAllDeliveryBoys, postAssignDeliveryBoy, postSendDeliveryOTP, postVerifyDeliveryOTP } from "../controller/delivery.controller.js";


const deliveryRouter = Router();

deliveryRouter.route("/all-delivery-boys").get(verifyAuthentication , getAllDeliveryBoys);
// deliveryRouter.route("/get-my-orders").get(verifyAuthentication ,getMyOrders);
deliveryRouter.route("/:orderId/assign-delivery-boy").post(verifyAuthentication ,postAssignDeliveryBoy);
deliveryRouter.route("/send-delivery-otp/:orderId").post(verifyAuthentication ,postSendDeliveryOTP);
deliveryRouter.route("/verify-delivery-otp/:orderId").post(verifyAuthentication ,postVerifyDeliveryOTP);
export default deliveryRouter;     