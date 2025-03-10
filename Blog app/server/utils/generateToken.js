import jwt from 'jsonwebtoken';
import {SECRET_KEY} from "./env_vars.js";
const generateToken = async(payload)=>{
    const res = await jwt.sign(payload, SECRET_KEY);
    return res;
}

export default generateToken;