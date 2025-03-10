import jwt from "jsonwebtoken";
import { SECRET_KEY } from "./env_vars.js";
import ErrorCreator from "./Error.js";
import HttpStatus from "./HttpStatus.js";
const verifyToken = async(req, res, next)=>{
    
    let token = (req.headers['Authorization'] || req.headers['authorization']);
    console.log('In verify Token with token==> ', token);
    if (!token) {
        const error = ErrorCreator.create({status : HttpStatus.FAIL, msg:'Token Must be provided', code : 401});
        return next(error);
    }
    token = token.split(' ')[1];
    try{
        const decodedToken = await jwt.verify(token, SECRET_KEY);
        req.currentUser = decodedToken;
        return next();
    }catch(err){
        const error = ErrorCreator.create({status : HttpStatus.FAIL, msg:'Invalid Token'+err.message, code:401});
        return next(error);
    }
}

export default verifyToken;