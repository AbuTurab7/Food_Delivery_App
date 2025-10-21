import { Router } from "express";
import { postPlaceOrder } from "../controller/order.controller.js";


const orderRouter = Router();

orderRouter.route("/place-order").post(postPlaceOrder);
export default orderRouter;