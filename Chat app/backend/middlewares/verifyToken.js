import ErrorCreator from "../utils/ErrorCreator.js";
import HttpStatus from "../utils/HttpStatus.js";
import jwt from "jsonwebtoken";

const verifyToken = async(req, res, next)=>{
    let token = req.headers['Authorization'] || req.headers['authorization'];
    if (!token) {
        const error = ErrorCreator.create(HttpStatus.FAIL, "Token Must be provided", 401);
        return next(error);
    }
    token = token.split(' ')[1];
    console.log(token);
    
    try {
        const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);
        console.log('Decoded Token ======> ', decodedToken);
        
        req.currentUserEmail = decodedToken.email;
        return next();
    } catch (err) {
        const error = ErrorCreator.create(HttpStatus.FAIL, "Invalid Token", 401);
        return next(error);
    }
}

export default verifyToken;