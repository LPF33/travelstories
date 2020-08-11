const jwt = require("jsonwebtoken");

function authJWT(req,res,next) {
    const token = req.header('authorization');

    if(!token){
        return res.json({success:false, token:true, error: "no token"});
    }

    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if(error){
            return res.json({success:false, token:true, error: error.message});
        }
        req.user = decoded;
        next();
    });
}

module.exports = authJWT;