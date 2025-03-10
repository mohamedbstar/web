const asyncWrapper = (asyncFn)=>{
    return (req, res, next)=>{
        asyncFn(req, res, next).catch((err)=>{
            console.log('In asyncWrapper');
            
            next(err);
        })
    }
}

export default asyncWrapper;