import {Router} from 'express';
import PostController from "../controllers/PostController.js"
import verifyToken from '../utils/verifyToken.js';
import verifyPostOwner from "../utils/verifyPostOwner.js"
import multer from "multer";

//File Upload Settings
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('FILE', file);
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const fileName = 'post-'+req.currentUser.id + Date.now() + '.' + ext;
        req.image = fileName;
        console.log("from diskStorage: " + req.image);
        
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

router.route("/")
    .get(PostController.getAllPosts)
    .post(verifyToken, upload.single('image'), PostController.createPost)

router.route("/:id")
    .get(PostController.getPost)
    .put(verifyToken,verifyPostOwner,upload.single('image') ,PostController.editPost) // edit post 
    .delete(verifyToken, verifyPostOwner, PostController.deletePost)
    
router.route("/categories/:category")
    .get(PostController.getCategoryPosts)

router.route("/users/:id")
    .get(PostController.getAuthorPosts)
router.route("myposts/:id")
    .get(verifyToken, PostController.getAuthorPosts)

export default router;