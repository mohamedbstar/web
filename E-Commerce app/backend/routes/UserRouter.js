import express from "express";
import multer from "multer";
import UserController from "../controllers/UserController.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyRole from "../middlewares/verifyManagerRoleOrSameUser.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";


//File Upload Settings
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('FILE', file);
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const fileName = 'post-' + Date.now() + '.' + ext;
        req.profilePic = fileName;
        console.log("from diskStorage: " + req.image);

        cb(null, fileName);
    }
})

const upload = multer({ storage: diskStorage });

const UserRouter = express.Router();

//register, login, getAllUsers, getUser, updateUser,deleteUser, checkUserPassword,

UserRouter.route("/register")
    .post(upload.single('profilePic'), UserController.register)


UserRouter.route("/login")
    .post(UserController.login)

UserRouter.route("/:id")
    .get(UserController.getUser)
    .put(UserController.verifyOtp)

UserRouter.route("/user/:email")
    .get(UserController.getUserByEmail)

UserRouter.route("/")
    .get(verifyToken, verifyAdmin, UserController.getAllUsers)
    .put(verifyToken, verifyRole, upload.single('profilePic'), UserController.editUser)
    .delete(verifyToken, verifyRole, UserController.deleteUser) 

UserRouter.route("/forgot/:email")
    .get(UserController.forgotPassword)

export default UserRouter;