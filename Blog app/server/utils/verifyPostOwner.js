import asyncWrapper from "../middlewares/asyncWrapper.js";
import User from "../models/user.js";
import Post from "../models/post.js";
import ErrorCreator from "./Error.js"
import HttpStatus from "./HttpStatus.js";
const verifyPostOwner = asyncWrapper(
    async (req, res, next) => {
        const post_id = req.params.id;
        const currentPost = await Post.findById(post_id);
        if(currentPost == null){
            const error = ErrorCreator.create(HttpStatus.FAIL, 'No Such Post', 404);
            return next(error);
        }
        const currentUser = await User.findOne({email:req.currentUser.email});
        if(currentUser == null){
            const error = ErrorCreator.create(HttpStatus.FAIL, 'No Such User', 404);
            return next(error);
        }
        if (currentUser._id == currentPost.user_id) {
            return next();
        }else{
            const error = ErrorCreator.create(HttpStatus.FAIL, 'User Is not authorized', 401);
            return next(error);
        }
    }
)

export default verifyPostOwner;