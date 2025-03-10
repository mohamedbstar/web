import express from "express"
import cors from "cors"
import "dotenv/config"
import HttpStatus from "./utils/HttpStatus.js"
import UserRouter from "./routes/UserRouter.js";
import ChatRouter from "./routes/ChatRouter.js";
import {initSocket} from "./controllers/ChatController.js"
import jwt from "jsonwebtoken"

import { Server } from "socket.io";
import http from "http";
import { log } from "console";
import ErrorCreator from "./utils/ErrorCreator.js";
import MessageModel from "./models/message.js";
import ChatModel from "./models/chat.js";


const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins (use specific domains in production)
        methods: ["GET", "POST"],
    },
    
});
let userSocket = new Map();

io.use((socket, next) => {
    console.log('inside io.use');
    
    const token = socket.handshake.auth.token;
    console.log('token is ' + token);
    
    if (!token) {
        console.log('no token');
        
        return next(ErrorCreator.create(HttpStatus.FAIL, "Token required!", 401));
    }
    try {
        console.log('decoding token');
        
        // Decode and verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        socket.currentUserEmail = decoded.email;
        console.log(socket.currentUserEmail);
        
        next(); // Continue with the connection
    } catch (err) {
        next(ErrorCreator.create(HttpStatus.FAIL, err.message, 500));
    }
})


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
        const contents = message.contents;
        const chat_id = message.chat_id; //generate a chat_id if it's null

        const newMessage = new MessageModel({ to, from, chat_id, contents });
        
        //emit the message content to the other user
        const toSocket = userSocket.has(to) ? userSocket.get(to) : null;
        if (toSocket) {
            toSocket.emit("receiveMessage", message);
            newMessage.delivered = true;
        }else{
            //the user is not logged 
            console.log('no toSocket');
        }
        //update the timestamp of chat corresponding to the message
        const updatedChat = await ChatModel.findOneAndUpdate({_id : chat_id}, {
            $set : {
                timestamp : Date.now(),
                lastMessage : newMessage
                }
            },
            { 
                returnDocument: "after"
            }   // Returns the updated document
        )
        if (updatedChat) {
            //only save the message when finding the chat
            await newMessage.save();
        }
        

    })
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use("/api/users", UserRouter);
app.use("/api/chats", ChatRouter);


app.all('*', (req, res, next) => {
    res.status(404).json({ status: HttpStatus.FAIL, message: "Resource Doesn't Exist", code: 404 });
})

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({ status: error.statusText, message: error.message, code: error.statusCode || 500 });
})

server.listen(5000, () => {
    console.log('App is listening on port 5000');
})