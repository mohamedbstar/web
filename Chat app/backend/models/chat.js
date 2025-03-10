import mongoose, { mongo } from "mongoose";

const ChateSchema = mongoose.Schema({
    members : {
        type : ["String"],
        required : true,
    },
    timestamp : {
        type : "Number",
        default : Date.now()
    },
    lastMessage : {
        type : "Object",
        default : "null"
    }
})

const ChatModel = mongoose.model('Chat', ChateSchema);
export default ChatModel;


