import mongoose from "mongoose";
import UserModel from "../models/user.js";
import ChatModel from "../models/chat.js";
import UserRoles from "../utils/userRoles.js";
import ErrorCreator from "../utils/ErrorCreator.js";
import HttpStatus from "../utils/HttpStatus.js";


const verifyAdminOrChatMember = async (req, res, next) => {
    const user_email = req.currentUserEmail;
    const chat_id = req.params.id;
    if (!user_email) {
        const error = ErrorCreator.create(HttpStatus.FAIL, "verifyAdminOrChatMember====> No User ID is provided", 401);
        return next(error);
    }

    await mongoose.connect(process.env.DB_URL);
    //get user
    const foundUser = await UserModel.findOne({email : user_email});
    if (!foundUser) {
        const error = ErrorCreator.create(HttpStatus.FAIL, "verifyAdminOrChatMember====> Wrong User ID", 404);
        return next(error);
    }
    //get chat
    const foundChat = await ChatModel.findById(chat_id);
    if (!foundChat) {
        const error = ErrorCreator.create(HttpStatus.FAIL, "verifyAdminOrChatMember====> Wrong Chat ID", 404);
        return next(error);
    }

    //get user role
    const userRole = foundUser.role;

    if (!userRole == UserRoles.ADMIN && !(foundChat.members.includes(user_id))) {
        const error = ErrorCreator.create(HttpStatus.FAIL, "verifyAdminOrChatMember====> Not Authorized user to get chat messages", 404);
        return next(error);
    }
    return next();
}

export default verifyAdminOrChatMember;