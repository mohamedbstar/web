import mongoose from "mongoose"

const OrderSchema = mongoose.Schema({
    id : {
        type : String,
        required : true
    },
    items : {
        type : [Object],
        required : true
    },
    status : {
        type : "String",
        enum : ['Deslivering', "Delivered"],
        default : "Deslivering"
    },
    user_id : {
        type : "String",
        required : true
    },
    timestamp : {
        type : "String",
        default : Date.now()
    }
})

const OrderModel = mongoose.model('Order', OrderSchema);
export default OrderModel;