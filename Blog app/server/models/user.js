import validator from "validator";
import mongoose from 'mongoose';
import { type } from "os";



const UserSchema = mongoose.Schema({
    name : {
        type : String, 
        required : true
    },
    email : {
        type : String,
        required : true,
        validate : [validator.isEmail, "Invalid Email Format"]
    },
    password : {
        type : String, 
        required : true
    },
    token : {
        type : String
    },
    avatar : {
        type : String,
        default : '/home/mohamed/web-dev/mern-blog/server/uploads/profile.png'
    },
    numPosts : {
        type : Number,
        default : 0
    }
})

export default mongoose.model('User', UserSchema);