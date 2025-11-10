import { Router } from "express";
import { verifyAuthentication } from "../middleware/verify-auth-middleware.js";
import { getAllDeliveryBoys, postAssignDeliveryBoy } from "../controller/delivery.controller.js";


const deliveryRouter = Router();

deliveryRouter.route("/all-delivery-boys").get(verifyAuthentication , getAllDeliveryBoys);
// deliveryRouter.route("/get-my-orders").get(verifyAuthentication ,getMyOrders);
deliveryRouter.route("/:orderId/assign-delivery-boy").post(verifyAuthentication ,postAssignDeliveryBoy);
export default deliveryRouter;     