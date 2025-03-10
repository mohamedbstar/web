import mongoose from "mongoose";

const MessageSchema = mongoose.Schema({
    from : {
        type : "String",
        required  : true
    },
    to : {
        type : "String",
        required  : true
    },
    chat_id : {
        type : "String", /*The chat to which the message belongs*/
        required  : true
    },
    timestamp : {
        type : "Number",
        default : Date.now()
    },
    delivered : {
        type : "Boolean",
        default : false
    },
    seen : {
        type : "Boolean",
        default  : false
    },
    contents : {
        type : "String",
        required : true
    },
})

const MessageModel = mongoose.model('Message', MessageSchema);
export default MessageModel;