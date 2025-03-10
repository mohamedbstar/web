import mongoose from "mongoose";
import UserModel from "../models/user.js";
import UserRoles from "../utils/userRoles.js";
import ErrorCreator from "../utils/ErrorCreator.js";
import HttpStatus from "../utils/HttpStatus.js";

const verifyRole = async(req, res, next)=>{
    console.log("In verify Role");
    console.log(req.body.email); 
    
    const currentUserEmail = req.currentUserEmail;
    console.log(req.body);
    
    const userToOperateOnEmail = req.body.email;

    if (!userToOperateOnEmail) {
        const error = ErrorCreator.create(HttpStatus.FAIL, "You Should Provide Email of desired user to operate on", 404);
        return next(error);
    }

    await mongoose.connect(process.env.DB_URL);

    const currentUser = await UserModel.findOne({email : currentUserEmail});
    const userToOperateOn = await UserModel.findOne({email : userToOperateOnEmail});
    if (userToOperateOn == null) {
        const error = ErrorCreator.create(HttpStatus.FAIL, "No Such User of such email exists", 404);
        return next(error);
    }
    if (currentUser.role != UserRoles.ADMIN && userToOperateOn.email != currentUser.email) {
        console.log('Current User Email ' + currentUser.email + " and user to opt on email is " + userToOperateOn.email);
        
        const error = ErrorCreator.create(HttpStatus.FAIL, "You Don't have authority to do such thing on this user", 404);
        return next(error);
    }
    console.log('Exiting Verify Role');
    
    return next();
}

export default verifyRole;