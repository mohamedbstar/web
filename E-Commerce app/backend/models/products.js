import mongoose from "mongoose";
import UserRoles from "../utils/userRoles.js";

const ProductSchema = mongoose.Schema({
    name : {
        type : String, 
        required : true
    },
    brand :{
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true,
    },
    images : {
        type : [String],
        required : true
    },
    category : {
        type : [String],
        required : true
    },
    price :  {
        type : Number,
        required : true
    },
    user_email : {
        type : String,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    }
})

const ProductModel = mongoose.model('products', ProductSchema);

export default ProductModel;