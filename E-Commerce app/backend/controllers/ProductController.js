import asyncControllerWrapper from "../middlewares/asyncControllerWrapper.js";
import mongoose, { mongo } from "mongoose";
import ErrorCreator from "../utils/ErrorCreator.js";
import HttpStatus from "../utils/HttpStatus.js";
import ProductModel from "../models/products.js";
import ProductRouter from "../routes/ProductRouter.js";


const getAllProducts = asyncControllerWrapper(
    async(req, res, next)=>{
        console.log('In Get All products');
        
        await mongoose.connect(process.env.DB_URL);
        const prods = await ProductModel.find();

        res.status(200).json({status : HttpStatus.SUCCESS, message : "All products", data : prods});
    }
)

const addProduct = asyncControllerWrapper(
    async(req, res, next)=>{
        await mongoose.connect(process.env.DB_URL);
        const {name, brand, category, price, sellingPrice, description, quantity} = req.body;
        const user_email = req.currentUserEmail;
        const newProd = new ProductModel({name, brand, category, price, sellingPrice, description, user_email, quantity});
        console.log('from add product ====> req.images: ' + req.images);
        
        newProd.images = req.images;

        await newProd.save();
        res.status(201).json({status : HttpStatus.SUCCESS, message : "Added Product", data : newProd});
    }
)

const getProductsByCategory = asyncControllerWrapper(
    async(req, res, next)=>{
        const cat = req.params.category;
        console.log('req.category =====> ' + cat);
        
        await mongoose.connect(process.env.DB_URL);
        const prods = await ProductModel.find({
            category : cat
        })
        res.status(200).json({status : HttpStatus.SUCCESS, message : "All products by category "+cat, data : prods});
    }
)

const getProduct = asyncControllerWrapper(
    async(req, res, next)=>{
        await mongoose.connect(process.env.DB_URL);
        const id = req.params.id;
        const prod = await ProductModel.findById(id);
        if (!prod) {
            const error = ErrorCreator.create(HttpStatus.FAIL, "No such Product Exists", 404);
            return next(error);
        }
        res.status(200).json({status : HttpStatus.SUCCESS, message : "Product by id " + id, data : prod});
    }
)

const editProduct = asyncControllerWrapper(
    async(req, res, next)=>{
        const product_id = req.params.id;
        await mongoose.connect(process.env.DB_URL);
        const {name, brand, category, price, sellingPrice, description, quantity} = req.body;
        const user_email = req.currentUserEmail;
        const images = req.images;


        //remove fields which have no value
        const compundObject = {
            ...req.body,
            images
        }
        const filterUpdateValues = Object.keys(compundObject).reduce((acc, key)=>{
            if (compundObject[key] !== undefined || compundObject[key] !== null || compundObject[key] !== '') {
                acc[key] = compundObject[key];
            }
            return acc;
        },{});
        console.log('filterUpdatedValues =====> ' + JSON.stringify(filterUpdateValues));
        
        const updatedProduct = await ProductModel.findByIdAndUpdate(product_id, 
            {$set : filterUpdateValues},
            {runValidators : true}
        )

        if (!updatedProduct) {
            const error = ErrorCreator.create(HttpStatus.FAIL, "No such Product Exists", 404);
            return next(error);
        }
        res.status(200).json({status : HttpStatus.SUCCESS, message : "Product is updated successfully", data : updatedProduct});
    }
)

const deleteProduct = asyncControllerWrapper(
    async(req, res, next)=>{
        const product_id = req.params.id;
        
        await mongoose.connect(process.env.DB_URL);

        const result = await ProductModel.deleteOne({_id : product_id});
        if (result.deletedCount == 0) {
            const error = ErrorCreator.create(HttpStatus.FAIL, "No such Product Exists", 404);
            return next(error);
        }
        res.status(200).json({status : HttpStatus.SUCCESS, message : "Deleted Product Successfully", data : null});
    }
)

//get All Categories

const ProductController = {getAllProducts, addProduct, getProduct, getProductsByCategory, editProduct, deleteProduct};
export default ProductController;