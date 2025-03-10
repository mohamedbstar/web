import Post from '../models/post.js'
import User from "../models/user.js"
import asyncWrapper from '../middlewares/asyncWrapper.js'
import mongoose, { mongo, Mongoose } from 'mongoose'
import { DB_URL } from '../utils/env_vars.js'
import HttpStatus from '../utils/HttpStatus.js'
import ErrorCreator from "../utils/Error.js"
import { SERVER_ASSET_URL } from '../../client/src/creds.js'
const getAllPosts = asyncWrapper(
    async(req, res, next)=>{
        await mongoose.connect(DB_URL);

        const allPosts = await Post.find();

        return res.status(200).json({status : HttpStatus.SUCCESS, data : allPosts, message : ''});
    }
)

const getPost = asyncWrapper(
    async(req, res, next)=>{
        await mongoose.connect(DB_URL);
        console.log('in getpost');
        
        const id = req.params.id;
        console.log('id: ' + id);
        
        const foundPost = await Post.findById(id);
        if(foundPost == null){
            const error = ErrorCreator.create(HttpStatus.FAIL, 'No Such Post Exists', 404);
            return next(error);
        }
        console.log('foundPost: ' + foundPost);
        

        res.status(200).json({status : HttpStatus.SUCCESS, data : foundPost, message : ''});
    }
)

const getAuthorPosts = asyncWrapper(  
    async(req, res, next)=>{
        console.log('in getAuthorPosts');
        await mongoose.connect(DB_URL);
        const user_id = req.params.id;
        console.log('req.params.id=====> ' + user_id);
        
        const posts = await Post.find({user_id : user_id});
        console.log('after posts.find()');
        

        res.status(200).json({status : HttpStatus.SUCCESS, data:posts, message:''});
    }
)

const createPost = asyncWrapper(
    async(req, res, next)=>{
        console.log('In create post');
        
        await mongoose.connect(DB_URL);
        const title = req.body.title;
        const content = req.body.content;
        const image = req.image || SERVER_ASSET_URL+"uploads/profile.png";  
        const cat = req.body.cat;
        console.log("Post image: " + req.image);
        
        const user_id = req.body.user_id;

        console.log(user_id);
        
        const cats = cat.split(',');

        const newPost = new Post({title:title, content:content, image:image, user_id:user_id, category : cats});

        await newPost.save();
        const postUser = await User.updateOne( {email : req.currentUser.email},
            {
                $inc : {
                    numPosts : 1
                }
            }
        );
        
        res.status(201).json({status: HttpStatus.SUCCESS, data:newPost, message:"post created successfully"});
    }
)

const editPost = asyncWrapper(
    async(req, res, next)=>{
        await mongoose.connect(DB_URL);
        const id = req.body.id;
        /*const title = req.body.title;
        const content = req.body.content;
        const image = req.body.image;
        const user_id = req.body.user_id;*/

        const oldPost = await Post.updateOne({id : id},{$set: {...req.body}});
        res.status(200).json({status : HttpStatus.SUCCESS, data:oldPost, message: 'post updated successfully'});
    }
)

const deletePost = asyncWrapper(
    async(req, res, next)=>{
        await mongoose.connect(DB_URL);
        const id = req.params.id;
        const post = Post.findByIdAndDelete(id);

        if (post == null) {
            const error = ErrorCreator.create(HttpStatus.FAIL, 'No Such Post exists', 404);
            return next(error);
        }

        res.status(200).json({status:HttpStatus.SUCCESS, data:post, message:"deleted successfully!"});
    }
)

const getCategoryPosts = asyncWrapper(
    async(req, res, next)=>{
        await mongoose.connect(DB_URL);
        const postsCategory = req.params.category;
        const posts = await Post.find({category : postsCategory});

        res.status(200).json({status: HttpStatus.SUCCESS, data:posts, mesage:''});
    }
)

const funcs = {getAllPosts, getPost, getAuthorPosts, createPost, editPost, deletePost, getCategoryPosts};

export default funcs;