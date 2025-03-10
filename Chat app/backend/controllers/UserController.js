import UserModel from "../models/user.js";
import ChatModel from "../models/chat.js";
import asyncControllerWrapper from "../middlewares/asyncControllerWrapper.js";
import mongoose, { mongo } from "mongoose";
import ErrorCreator from "../utils/ErrorCreator.js";
import HttpStatus from "../utils/HttpStatus.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
import transport from "../config/mailer.js";
import { create } from "domain";
import MessageModel from "../models/message.js";



//register, login, getAllUsers, getUser, updateUser,deleteUser, checkUserPassword,

const register = asyncControllerWrapper(
    async (req, res, next) => {
        //check if all required fields are provided
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            const error = ErrorCreator.create(HttpStatus.FAIL, "Login Controller:  Must Provide Credentials", 401);
            return next(error);
        }
        //check if email is not already registered
        await mongoose.connect(process.env.DB_URL);
        const foundUser = await UserModel.findOne({ email });
        if (foundUser) {
            const error = ErrorCreator.create(HttpStatus.FAIL, "Email Already Exists", 402);
            return next(error);
        }
        //handle hashing password
        const hashedPass = await bcrypt.hash(password, 10);

        //store in the database
        const newUser = new UserModel({ name, email, password: hashedPass });

        //handle profile pic
        const profilePic = req.profilePic || "profile.png";
        newUser.profilePic = profilePic;
        await newUser.save();
        res.status(201).json({ status: HttpStatus.SUCCESS, message: "User Created Successfully", data: newUser });
    }
)


const login = asyncControllerWrapper(
    async (req, res, next) => {
        //check if all required fields are provided
        const { email, password } = req.body;
        if (!email || !password) {
            const error = ErrorCreator.create(HttpStatus.FAIL, "Login Controller: Must Provide Credentials", 401);
            return next(error);
        }
        //check if email is not already registered
        await mongoose.connect(process.env.DB_URL);
        const foundUser = await UserModel.findOne({ email });
        if (!foundUser) {
            const error = ErrorCreator.create(HttpStatus.FAIL, "User Doesn't exist", 401);
            return next(error);
        }
        //check password match
        const foundUserPass = foundUser.password;
        const isMatch = await bcrypt.compare(password, foundUserPass);
        if (!isMatch) {
            const error = ErrorCreator.create(HttpStatus.FAIL, "Wrong Password", 401);
            return next(error);
        }

        //create token
        const token = await createToken({ email });

        res.status(200).json({
            status: HttpStatus.SUCCESS, message: "Login Successful", data: {
                user: foundUser,
                token: token
            }
        });
    }
)

const forgotPassword = asyncControllerWrapper(
    async (req, res, next) => {
        const email = req.params.email;
        await mongoose.connect(process.env.DB_URL);
        const foundUser = await UserModel.findOne({ email: email });
        if (!foundUser) {
            const error = ErrorCreator.create(HttpStatus.FAIL, "User Is Not registered", 400);
            return next(error);
        }
        //send the email
        //create the otp for confirmation
        const otp = String(Math.floor(Math.random() * 999999));
        //set otp to otp in user model
        foundUser.otp = otp;
        //set otpVerified false
        foundUser.otpVerified = false;
        //create the email
        try {
            const mailOptions = {
                from: "mohamed@localhost",//process.env.SENDER_EMAIL,
                to: "user@localhost",
                subject: "OTP",
                text: `OTP is ${otp}`
            }

            //send the mail
            await transport.sendMail(mailOptions);
            //save user after successfully sending the email
            await foundUser.save();
        } catch (error) {
            console.log(error);
            return res.json({ status: false, message: error.message })
        }
        //return success
        res.status(200).json({ status: HttpStatus.SUCCESS, message: "successful", data: null });
    }
)

const getUserByEmail = asyncControllerWrapper(
    async (req, res, next) => {
        const email = req.params.email;
        await mongoose.connect(process.env.DB_URL);
        const foundUser = await UserModel.findOne({ email: email });
        if (!foundUser) {
            const error = ErrorCreator.create(HttpStatus.FAIL, "User Is Not registered", 400);
            return next(error);
        }
        console.log('getUserByEmail user otp is ' + foundUser.otp);
        
        res.status(200).json({ status: HttpStatus.SUCCESS, message: "successful", data: foundUser });
    }
)

const verifyOtp = asyncControllerWrapper(
    async(req, res, next)=>{
        await mongoose.connect(process.env.DB_URL);
        const id = req.params.id;
        const foundUser = await UserModel.findById(id);
        foundUser.otp = "";
        foundUser.otpVerified = true;
        await foundUser.save();
        const token = await createToken({email : foundUser.email});
        console.log('foundUser.token ===> ' + foundUser.token);
        res.status(200).json({ status: HttpStatus.SUCCESS, message: "successfully updated user", data: {user: foundUser, token : token} });
    }
)


const getUserChats = asyncControllerWrapper(
    async(req, res, next)=>{
        console.log('in getUSerChats');
        
        const user_id = req.params.user_id;
        await mongoose.connect(process.env.DB_URL);

        const foundUser = await UserModel.findById(user_id);
        if (!foundUser) {
            const error = ErrorCreator.create(HttpStatus.FAIL, "UserController:getUserChats====> Wrong User ID", 404);
            return next(error);
        }
        const allUserChats = await ChatModel.find({members : foundUser.email});
        //get last message of all chats
        for(let c of allUserChats){
            const c_id = c._id;
            let chatMsgs = await MessageModel.find({chat_id : c_id});
            c.lastMessage = chatMsgs.length > 0 ? chatMsgs[chatMsgs.length - 1] : null;
        }
        res.status(200).json({ status: HttpStatus.SUCCESS, message: "all user chats", data: allUserChats });
    }
)

const addNewUserChat = asyncControllerWrapper(
    async(req, res, next)=>{
        await mongoose.connect(process.env.DB_URL);
        const user1 = req.currentUserEmail;
        const user2 = req.body.anotherUser;

        const newChat = new ChatModel({members : [user1, user2]});
        await newChat.save();
        res.status(200).json({ status: HttpStatus.SUCCESS, message: "new chat", data: newChat});
    }
)

const getAllUsers = asyncControllerWrapper(
    async (req, res, next) => {
        await mongoose.connect(process.env.DB_URL);
        const allUsers = await UserModel.find();
        res.status(200).json({ status: HttpStatus.SUCCESS, message: "All Users", data: allUsers });
    }
)

const getUser = asyncControllerWrapper(
    async (req, res, next) => {
        await mongoose.connect(process.env.DB_URL);
        const userId = req.params.id;
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            const error = ErrorCreator.create(HttpStatus.FAIL, "Wrong ID", 404);
            return next(error);
        }
        res.status(200).json({ status: HttpStatus.SUCCESS, message: "User Details", data: foundUser });
    }
)

const editUser = asyncControllerWrapper(
    async (req, res, next) => {
        console.log('in edit user');
        const { name, email, role, password } = req.body;
        const profilePic = req.profilePic;
        console.log(name, email, role, password,profilePic);
        
        if (!email) {
            const error = ErrorCreator.create(HttpStatus.FAIL, "Email Must be provided to edit user", 400);
            return next(error);
        }

        if (!name && !email && !role && !password && !profilePic) {
            return res.status(202).json({ status: HttpStatus.SUCCESS, message: "Nothing to update", data: null });
        }

        await mongoose.connect(process.env.DB_URL);
        let hashedPass;
        if (password) {
            hashedPass = await bcrypt.hash(password, 10);
        }
        const userBeforeEdit = await UserModel.findOne({ email });
        if (userBeforeEdit == null) {
            const error = ErrorCreator.create(HttpStatus.FAIL, "No Such User Exists to edit", 400);
            return next(error);
        }
        console.log('before edit ' + userBeforeEdit);
        
        const foundUser = await UserModel.findOneAndUpdate({ email }, {
            $set: {
                name: name || userBeforeEdit.name,
                email,
                role: role || userBeforeEdit.role,
                profilePic: profilePic || userBeforeEdit.profilePic,
                password: hashedPass || userBeforeEdit.password
            }
        }, { new: true });

        if (!foundUser) {
            const error = ErrorCreator.create(HttpStatus.FAIL, "User Not Found", 404);
            return next(error);
        }
        console.log('foundUser ' + foundUser);
        
        
        res.status(200).json({ status: HttpStatus.SUCCESS, message: "Updated User Successfully", data: foundUser });
    }
)

const deleteUser = asyncControllerWrapper(
    async (req, res, next) => {
        const { email } = req.body;
        if (!email) {
            const error = ErrorCreator.create(HttpStatus.FAIL, "Please Provide an email to delete", 402);
            return next(error);
        }
        await mongoose.connect(process.env.DB_URL);
        const result = await UserModel.deleteOne({ email });
        if (result.deletedCount == 0) {
            const error = ErrorCreator.create(HttpStatus.FAIL, "User Not Found", 404);
            return next(error);
        }
        res.status(200).json({ status: HttpStatus.SUCCESS, message: "deleted user successfully", data: null });
    }
)

const getUserSearchResult = asyncControllerWrapper(
    async(req, res, next)=>{
        console.log('in getUserSearchResult');
        
        await mongoose.connect(process.env.DB_URL);
        const keyword = req.params.keyword;
        console.log(keyword);
        const users = await UserModel.find({$or : [
            {
                name : {$regex : keyword, $options : "i"}
            },{
                email : {$regex : keyword, $options : "i"}
            }
        ]})
        console.log('after find ' + users);
        res.status(200).json({ status: HttpStatus.SUCCESS, message: "all matched users", data: users });
    }
)

const UserController = { register, login, getUserSearchResult,getUserChats,addNewUserChat,getAllUsers, getUser, editUser, deleteUser, forgotPassword, verifyOtp, getUserByEmail }

export default UserController;