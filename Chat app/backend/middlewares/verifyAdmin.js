import mongoose from "mongoose";
import UserModel from "../models/user.js";
import UserRoles from "../utils/userRoles.js";
import ErrorCreator from "../utils/ErrorCreator.js";
import HttpStatus from "../utils/HttpStatus.js";

const verifyAdmin = async(req, res, next)=>{
    console.log("In verify Role");
    
    const currentUserEmail = req.currentUserEmail;

    await mongoose.connect(process.env.DB_URL);

    const currentUser = await UserModel.findOne({email : currentUserEmail});
    if (!currentUser) {
        const error = ErrorCreator.create(HttpStatus.FAIL, "Valid token but user doesn't exist", 401);
        return next(error);
    }
    if (currentUser.role != UserRoles.ADMIN) {
        console.log('Current User Email ' + currentUser.email);
        
        const error = ErrorCreator.create(HttpStatus.FAIL, "You Don't have authority to add a product", 404);
        return next(error);
    }
    console.log('Exiting Verify Role');
    
    return next();
}

export default verifyAdmin;