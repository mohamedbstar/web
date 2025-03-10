import ChatModel from "../models/chat.js";
import MessageModel from "../models/message.js";
import HttpStatus from "../utils/HttpStatus.js";
import ErrorCreator from "../utils/ErrorCreator.js"
import mongoose from "mongoose";
import asyncControllerWrapper from "../middlewares/asyncControllerWrapper.js"

let io; // Declare a variable for socket.io

let userSocket = new Map();
// Function to initialize Socket.io
export function initSocket(socketIo) {
    console.log('inside initSocket');
    
    io = socketIo;
    io.on('connection', (socket) => {
        console.log('got a new connection from ' + socket.currentUserEmail);
        userSocket.set(socket.currentUserEmail, socket);

        socket.on('sendMessage', async (message, next) => {
            if (!message) {
                return next(ErrorCreator.create(HttpStatus.FAIL, "Message required", 400));
            }

            console.log('got message from ' + socket.currentUserEmail);
            const from = socket.currentUserEmail;
            const to = message.to; //email of the receiver
            const content = message.content;
            const chat_id = message.chat_id;

            const newMessage = new MessageModel({ to, from, chat_id, content });
            
            //emit the message content to the other user
            const toSocket = userSocket.has(to) ? userSocket.get(to) : null;
            if (toSocket) {
                toSocket.emit("receiveMessage", message);
                newMessage.delivered = true;
            }
            await newMessage.save();
        })
    })
};



const getChatMessages = asyncControllerWrapper(
    async (req, res, next) => {
        const chat_id = req.params.id;
        await mongoose.connect(process.env.DB_URL);

        const allChatMsgs = await MessageModel.find({ chat_id: chat_id });
        for(let msg of allChatMsgs){
            msg.seen = true
            await msg.save();
        }
        for(let msg of allChatMsgs){
            console.log(msg.seen);
        }
        
        res.status(200).json({ status: HttpStatus.SUCCESS, message: "All Chat Messages", data: allChatMsgs });
    }
)

const addMessageToChat = asyncControllerWrapper(
    async (req, res, next) => {
        const chat_id = req.params.id;
        const { from, to, contents } = req.body;
        await mongoose.connect(process.env.DB_URL);

        const newMsg = new MessageModel({ from, to, chat_id, contents });
        await newMsg.save();
        res.status(201).json({ status: HttpStatus.SUCCESS, message: "Added Message", data: newMsg });
    }
)


const ChatController = { getChatMessages, addMessageToChat }

export default ChatController;