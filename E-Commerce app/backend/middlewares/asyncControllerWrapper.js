const asyncControllerWrapper = (asyncFn)=>{
    return(req, res, next)=>{
        asyncFn(req, res, next).catch((err)=>{
            console.log('In asyncControllerWapper with error=> ', err.message);
            return next(err);
        })
    }
}

export default asyncControllerWrapper;