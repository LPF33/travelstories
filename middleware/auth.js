const jwt = require("jsonwebtoken");

function authJWT(req,res,next) {
    const token = req.header('authorization');

    if(!token){
        return res.status(401).json({success:false,  error: "no token"});
    }

    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if(error){
            return res.status(401).json({success:false,  error: error.message});
        }
        req.user = decoded;
        next();
    });
}

module.exports = authJWT;