const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("../config/bcrypt");
const validation = require("../config/validationServer");
const jwt = require("jsonwebtoken");

function generateAccessToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
}

router.post("/register", async(req,res) => {
    const {email, password, name, password2} = req.body;
    const error = [];
    if(!email || !password || !name){
        error.push("Please,  fill in all fields");
    }
    if(password!==password2){
        error.push("Your passwords do not match!");
    }

    const nameCheck = validation.checkName(name);
    const passwordCheck = validation.checkPassword(password);
    const emailCheck = validation.checkEmail(email);
    if(!nameCheck[0] || !passwordCheck[0] || !emailCheck[0]){
        error.push(nameCheck[1]);
        error.push(passwordCheck[1]);
        error.push(emailCheck[1]);
    }

    if(error.length>0){
        res.json({
            success:false,
            name,
            email,
            error        
        });
    }else{
        try{
            const checkUser = await User.findOne({email: email}).lean();
            if(checkUser){
                res.json({
                    success:false,
                    error: ["Please, try a different email address!"],
                    name,
                    email: ""
                });
            }else{
                const hashPassword = await bcrypt.hash(password);
                const newUser = new User({
                    name,
                    email, 
                    password : hashPassword
                });

                const savedUser = await newUser.save();
                const token = generateAccessToken({id:savedUser._id, name:savedUser.name, picture:savedUser.picture});
                res.json({
                    success:true,
                    token
                });
            }  
        }catch(err){
            res.json({
                success:false,
                error: ["Server error"]
            });
        } 
    }
    
});

router.post("/login", async(req,res) => {
    const {email, password} = req.body;
    if(!email || !password){
        res.json({
            success:false,
            email,
            error: ["Please,  fill in all fields"]  
        });
    }else{
        
        try{
            const foundUser = await User.findOne({email: email}).lean();
            if(foundUser){
                const checkPassword = await bcrypt.compare(password, foundUser.password);
                if(checkPassword){
                    const token = generateAccessToken({id:foundUser._id, name:foundUser.name, picture:foundUser.picture});
                    res.json({
                        success:true,
                        token
                    });
                }else{
                    res.json({
                        success:false,
                        error: ["Your email or password is not correct"]
                    });
                }
            }else{
                res.json({
                    success:false,
                    error: ["Your email or password is not correct"]
                });
            }            
        }catch(err){
            res.json({
                success:false,
                error: ["Server error"]
            });
        }
    }
    
});

module.exports = router;