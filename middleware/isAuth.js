const jwt = require('jsonwebtoken')

module.exports = (req,res,next) =>{
    const authHeader = req.get('Authorization');
    if(!authHeader) {
        console.log('no Authorization key in header')
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    if(!token || token ===''){
        req.isAuth = false;
        return next();
    }
    try{
        const decodeToken = jwt.verify(token,'superdupersecrettime');
        if(!decodeToken){
            req.isAuth = false;
            return next();
        }
        req.isAuth = true;
        req.userId = decodeToken.userId;
        return next();  
    } catch (err){
        req.isAuth = false;
        return next();
    }  
      
}