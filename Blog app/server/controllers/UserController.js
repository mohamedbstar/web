import { validationResult } from "express-validator";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import ErrorCreator from "../utils/Error.js";
import HttpStatus from "../utils/HttpStatus.js";
import mongoose from "mongoose";
import User from "../models/user.js";
import { log } from "console";
import bcrypt from 'bcryptjs';
import generateToken from "../utils/generateToken.js";
import { DB_URL } from "../utils/env_vars.js";
import { SERVER_ASSET_URL } from "../../client/src/creds.js";

// =============== Register new user=======
//Unprotected
const registerUser = asyncWrapper(
    async (req, res, next) => {
        console.log('Inside register usercontroller');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Inside register validatin error');
            console.log(errors);

            const error = ErrorCreator.create(HttpStatus.FAIL, "Validation Error", 400);
            return next(error);
        }
        console.log('Before db access');

        await mongoose.connect(DB_URL);
        console.log('after db access');
        const foundUser = await User.findOne({ email: req.body.email });
        console.log('after db findOne');
        if (foundUser != null) {
            console.log('Inside register founduser');
            const error = ErrorCreator.create(HttpStatus.FAIL, "Email Is Already Registered", 422);
            return next(error);
        }
        console.log('after founduser != null');
        //handle hashing
        let hashedPass = await bcrypt.hash(req.body.password, 10);
        console.log('after hashing');
        const newUser = new User({ name: req.body.name, email: req.body.email, password: hashedPass, avatar: req.avatar || SERVER_ASSET_URL + 'uploads/profile.png' });
        console.log('Inside register after newUser');
        //handle token
        newUser.token = await generateToken({ email: newUser.email, id: newUser.id });
        console.log('Inside register after generaste token');
        console.log("req.avatar: " + req.avatar);

        await newUser.save();
        console.log('Inside register after save');
        res.status(201).json({ status: HttpStatus.SUCCESS, data: newUser, message: 'User Created Successfully' });
    }
)

const loginUser = asyncWrapper(
    async (req, res, next) => {
        console.log('In Login function');
        console.log(req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('In validationResult notEmpty');
            const error = ErrorCreator.create({ status: HttpStatus.FAIL, msg: errors, code: 401 });
            return next(error);
        }
        console.log("After validationResult");
        await mongoose.connect(DB_URL);
        console.log("After DB connect");
        const foundUser = await User.findOne({ email: req.body.email });

        console.log("After foundUser");
        if (foundUser == null) {
            console.log("In foundUer = null");
            const error = ErrorCreator.create(HttpStatus.FAIL, 'No Such User Exists!', 404);
            return next(error);
        }
        console.log("After foundUsr if");
        //check for password match
        const passwordMatches = await bcrypt.compare(req.body.password, foundUser.password);
        console.log("After passwordMathes");
        if (!passwordMatches) {
            console.log("inside pass doesn't match");
            const error = ErrorCreator.create(HttpStatus.FAIL, 'Invalid Password', 401);
            return next(error);
        }
        console.log("After !passwordMatches");

        res.status(200).json({ status: HttpStatus.SUCCESS, data: { token: foundUser.token, user_id: foundUser._id }, message: 'Logged in successfully' });
    }
)

const getAllAuthors = asyncWrapper(
    async (req, res, next) => {
        await mongoose.connect(DB_URL);

        const allUsers = await User.find();
        res.status(200).json({ status: HttpStatus.SUCCESS, data: allUsers, message: '' });
    }
)

const getAuthor = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.id;
        await mongoose.connect(DB_URL);
        const foundUser = await User.findById(id);

        if (foundUser == null) {
            const error = ErrorCreator.create(HttpStatus.FAIL, 'No Such User Exists', 404);
            return next(error);
        }

        res.status(200).json({ status: HttpStatus.SUCCESS, data: foundUser, code: 200 });
    }
)

const checkPassword = asyncWrapper(
    async (req, res, next) => {
        console.log('In Check Password');
        console.log(req.body.password);

        //now the user is requesting to edit his own password
        await mongoose.connect(DB_URL);
        const foundUser = await User.findById(req.params.id);

        //assert password in the body of request and found user password are equal
        const passwordMatches = await bcrypt.compare(req.body.password, foundUser.password);

        res.status(200).json({ status: HttpStatus.SUCCESS, data: passwordMatches, message: '' });
    }
)

//Handle later
const updateUser = asyncWrapper(
    async (req, res, next) => {
        console.log('in update user');
        console.log('req.body.id =====> ' + req.body.id);

        const user_id = req.body.id;
        const foundUser = await User.findById(req.body.id);
        let hashedPass = await bcrypt.hash(req.body.password, 10);
        
        const result = await User.updateOne({ email: req.body.email }, {...req.body, password : hashedPass, avatar : req.avatar });

        res.status(200).json({ status: HttpStatus.SUCCESS, data: result, message: 'Updated User Successfully!' });
    }
)

const funcs = { registerUser, loginUser, getAllAuthors, getAuthor, checkPassword, updateUser };
export default funcs;