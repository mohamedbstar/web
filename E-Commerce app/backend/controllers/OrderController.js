import asyncControllerWrapper from "../middlewares/asyncControllerWrapper.js";
import mongoose, { mongo } from "mongoose";
import ErrorCreator from "../utils/ErrorCreator.js";
import HttpStatus from "../utils/HttpStatus.js";
import OrderModel from "../models/order.js";
import OrderRouter from "../routes/OrderRouter.js";
import ProductModel from "../models/products.js"
import Stripe from "stripe"
import UserController from "./UserController.js";
import UserModel from "../models/user.js";

const stripe = new Stripe(process.env.STRIPE_API_KEY); //configure stripe

const getAllOrders = asyncControllerWrapper(
    async (req, res, next) => {
        await mongoose.connect(process.env.DB_URL);
        const allOrders = await OrderModel.find();
        res.status(200).json({ status: HttpStatus.SUCCESS, message: "all orders", data: allOrders });
    }
)

const placeOrder = asyncControllerWrapper(
    async (req, res, next) => {
        //user email will be in the request as currentUserEmail
        //body will contain array of item IDs with corresponding quantity for each itemId
        
        

        const user_email = req.currentUserEmail;
        const items = req.body.items;
        console.log(typeof(items));
        
        console.log(items[0]);
        let item_ids = items.map((i) => i._id);
        console.log('item ids '+ item_ids.length);
        
        let items_objs = [];
        await mongoose.connect(process.env.DB_URL);
        for (const id of item_ids){
            console.log('id is ' + id);
            let p = await ProductModel.findById(id);
            console.log("p is " + p);
            items_objs = [...items_objs , p];
           
            console.log('items_objs length ' + items_objs.length );
        };
        
        console.log('items: ' + { ...items });
        console.log('items_objs length' + items_objs.length );

        const items_in_line = await items_objs.map((i, index) => {
            console.log('in line_items ' + i.name);
            
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: i.name
                    },
                    unit_amount: Number(i.price) * 100
                },
                quantity: items[index].quantity
            }
        })
        console.log('items_in_line length is ' + items_in_line.length);
        

        //create a stripe session0
        try {
            const stripe_session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items :items_in_line,
                success_url: "http://localhost:3000/checkout-success",
                cancel_url: "http://localhost:3000/cart",
            })
            res.json({ status: HttpStatus.SUCCESS, message: "success", data: null, url: stripe_session.url })
        } catch (error) {
            console.log('stripe errorrrrrr');
            console.log(error.message);

        }
    }
)

const getOrder = asyncControllerWrapper(
    async (req, res, next) => {
        //get order by id from params
        const id = req.params.id;
        await mongoose.connect(process.env.DB_URL);

        const order = await OrderModel.findOne({ id: id });
        if (!order) {
            const error = ErrorCreator.create(HttpStatus.FAIL, "No Such order exists", 404);
            return next(error);
        }
        res.status(200).json({ status: HttpStatus.SUCCESS, message: "order", data: order });
    }
)

const getUserOrders = asyncControllerWrapper(
    async (req, res, next) => {
        const user_id = req.params.user_id;
        await mongoose.connect(process.env.DB_URL);
        const allOrders = await OrderModel.find({ user_id: user_id });
        res.status(200).json({ status: HttpStatus.SUCCESS, message: "all orders", data: allOrders });
    }
)

const addUserOrder = asyncControllerWrapper(
    async(req, res, next)=>{
        const userEmail = req.currentUserEmail;
        const order = req.body.cart.CartSlice;
        await mongoose.connect(process.env.DB_URL);
        const User = await UserModel.findOne({email:userEmail});
        const orderId = String(Math.floor(Math.random()*9999999999))
        const newOrder = new OrderModel({id:orderId, items : order, user_id:User._id});

        await newOrder.save();
        res.status(201).json({status:HttpStatus.SUCCESS, message : "Created Order Successfully", data:null});
    }
)

const OrderController = { getAllOrders, placeOrder, getOrder, getUserOrders ,addUserOrder};
export default OrderController;