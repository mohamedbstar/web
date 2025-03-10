import express from 'express';
import cors from 'cors';
import {connect} from 'mongoose';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import dotenv from 'dotenv';
dotenv.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import UserRouter from './routes/UserRoutes.js';
import PostRouter from './routes/PostRoutes.js';
import HttpStatus from './utils/HttpStatus.js';
import path from 'path';

const app = express();

app.use(express.json({extended : true}));
app.use(express.urlencoded({extended : true}));
app.use(cors({origin:'*'}));
app.use('/uploads', express.static(path.join(dirname(__filename), 'uploads'))); //for static files


app.use('/api/users', UserRouter);
app.use('/api/posts', PostRouter);

app.all("*", (req, res)=>{
    res.status(404).json({status : HttpStatus.ERROR, message:"Resource is not found"});
})

app.use((error, req, res, next)=>{
    res.status(error.statusCode || 500).json({status : error.statusText || HttpStatus.ERROR, message : error.message, data : error});
})

app.listen(5000, ()=>{
    console.log("App is listening on port 5000");
})