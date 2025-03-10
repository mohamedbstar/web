import express, { Router } from "express";
import HttpStatus from "../utils/HttpStatus.js";
import multer from "multer"
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import OrderController from "../controllers/OrderController.js";
import verifyRole from "../middlewares/verifyManagerRoleOrSameUser.js";

const OrderRouter = express.Router();

OrderRouter.route("/")
    .get(/*verifyToken, verifyAdmin,*/ OrderController.getAllOrders)
    .post(verifyToken, OrderController.placeOrder) //place a new order

OrderRouter.route("/:id")
    .get(verifyToken, OrderController.getOrder)

OrderRouter.route("/user/:user_id")
    .get(verifyToken, OrderController.getUserOrders)
    .post(verifyToken, verifyRole, OrderController.addUserOrder)


export default OrderRouter;