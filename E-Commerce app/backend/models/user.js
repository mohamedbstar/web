import mongoose from "mongoose";
import UserRoles from "../utils/userRoles.js";

const UserSchema = mongoose.Schema({
    name : {
        type : String, 
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String, 
        required : true
    },
    role : {
        type : String,
        required : true,
        enum : [UserRoles.ADMIN, UserRoles.USER],
        default : 'user'
    },
    profilePic : {
        type : String,
        default : ""
    },
    otp : {
        type : String,
        default : ""
    },
    otpVerified : {
        type : Boolean,
        default : true
    }
})

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;