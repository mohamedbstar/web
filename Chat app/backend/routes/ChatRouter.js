import express from "express";
import multer from "multer";
import UserController from "../controllers/UserController.js";
import ChatController from "../controllers/ChatController.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyRole from "../middlewares/verifyManagerRoleOrSameUser.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyAdminOrChatMember from "../middlewares/verifyAdminOrChatMember.js";


const ChatRouter = express.Router();


ChatRouter.route("/:id")
    .get(verifyToken, verifyAdminOrChatMember, ChatController.getChatMessages)
    .post(verifyToken,verifyAdminOrChatMember, ChatController.addMessageToChat)



export default ChatRouter