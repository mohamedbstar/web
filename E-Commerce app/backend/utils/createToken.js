import jwt from "jsonwebtoken";

const createToken = async(payload)=>{
    const token = await jwt.sign(payload, process.env.SECRET_KEY);
    return token;
}

export default createToken;