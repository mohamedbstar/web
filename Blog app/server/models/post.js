import mongoose, { mongo } from "mongoose";
import { type } from "os";

const PostSchema = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    content : {
        type : String, 
        required : true
    },
    image : {
        type : String, 
    },
    user_id : {
        /*type : mongoose.Schema.Types.ObjectId,
        ref : 'User',*/
        type : String,
        required : true
    },
    category : {
        type : [String]
    }
})

export default mongoose.model('Post', PostSchema);