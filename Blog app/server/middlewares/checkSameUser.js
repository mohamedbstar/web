import Error from "../utils/Error.js";
import HttpStatus from "../utils/HttpStatus.js";

const checkSameUser = (req, res, next)=>{
    console.log('in check same user');
    
    console.log('req.currentUserId= ', req.currentUser.id);
    console.log('req.params.id= ', req.params.id);
    console.log('req: ' + Array(req.params));
    console.log('originalUrl ' + req.originalUrl);
    
    //i have the id in the request params and current user id in the req object from previous middleware
    if (req.currentUser.id == req.params.id) {
        return next();
    }else{
        const error = Error.create(HttpStatus.FAIL, 'Requesting to edit different user profile', 401);
        return next(error);
    }
}


export default checkSameUser;