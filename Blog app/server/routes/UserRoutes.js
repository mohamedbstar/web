import { Router } from 'express';
import UserController from "../controllers/UserController.js";

import multer from 'multer';
import Error from '../utils/Error.js';
import HttpStatus from '../utils/HttpStatus.js';
import { body, header } from 'express-validator';
import verifyToken from "../utils/verifyToken.js"
import checkSameUser from '../middlewares/checkSameUser.js';

//File Upload Settings
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('FILE', file);
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const fileName = 'user-' + Date.now() + '.' + ext;
        req.avatar = fileName;
        cb(null, fileName);
    }
})

const fileFilter = (req, file, cb) => {
    const fileType = file.mimetype.split('/')[0];
    if (fileType === 'image') {
        cb(null, true);
    } else {
        cb(Error.create(HttpStatus.FAIL, 'Only images are allowed!'), false);
    }
}

const upload = multer({ storage: diskStorage, fileFilter: fileFilter });


const router = Router();

//Register new user =====> Unprotected
router.route('/register')
    .post(
        /*[
            /*body('name')
                .notEmpty().withMessage('Name Must be provided'),
            body('email')
                .notEmpty().withMessage('Email Must be provided'),
            body('password').notEmpty().withMessage('Password Must be provided')
                .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
            body('confirmPassword')
                .notEmpty().withMessage('Password Confirmation Must be provided'),
        ],*/ upload.single('avatar'), UserController.registerUser)

router.route('/login')
    .post(
        /*[
            body('email')
                .notEmpty().withMessage('Email Must be provided'),
            body('password').notEmpty().withMessage('Password Must be provided')
                .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
        ],*/ UserController.loginUser
    )

//Get All Authors =====> Protected
router.route('/')
    .get(
        /*[
            header('authorization').notEmpty().withMessage('Token Must be provided')
        ], verifyToken,*/ UserController.getAllAuthors) //Get All Authors =====> Protected

router.route("/:id")
    .get(UserController.getAuthor) //Get a Single Author =====> Protected
    .post(verifyToken,checkSameUser,UserController.checkPassword) //check for password is true or false
    .put(verifyToken,upload.single('avatar'),checkSameUser, UserController.updateUser) //update user

export default router;