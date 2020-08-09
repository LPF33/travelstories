const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Mail = require("../models/mail");
const Friends = require("../models/friends");
const TravelPlace = require("../models/location");
const uploader = require("../config/multer");
const S3 = require("../config/S3");
const {hash} = require("../config/bcrypt");
const validation = require("../config/validationServer");
const authJWT = require("../middleware/auth");

router.use(authJWT);

router.get("/", async(req,res) => {
    try{
        const user = await User.findById(req.user.id, {password:0}).lean();
        if(user){
            res.json({
                success:true,
                user
            });
        }else{
            res.json({
                success:false
            });
        }
        
    }catch(error){
        res.json({
            success:false
        });
    }
});

router.post("/update", async(req,res) => {
    if(req.body.picture){
        const pictureFileURL = await User.findByIdAndUpdate(req.user.id, {picture: ""} , {select:"picture"}).lean();   
    
        if(pictureFileURL.picture){
            const pictureFilePath = new URL(pictureFileURL.picture);
            const pictureFile = pictureFilePath.pathname.slice(1);
            await S3.deleteFromS3(pictureFile);
        }
    }    

    let body = Object.create(Object.prototype);
    for(let key in req.body){
        if(req.body[key] && key!=="id"){
            if(key==="password"){
                const hashedPassword = await hash(key);
                body[key] = hashedPassword;
            }else{
                body[key] = req.body[key];
            }            
        }
    }
    try{
        await User.updateOne({_id : req.body.id},body,{runValidators:true});
        res.json({
            success:true
        });
    }catch(error){
        if(error.code===11000){
            res.json({success:false,error:"Try a different email"});
        }else{
            res.json({success:false,error});
        }
        
    }
});

router.post("/upload/picture", uploader.single("file"), async(req,res) => {
    const photoUrl = S3.getBucketURL(req.file.filename);

    try {
        await S3.uploadToS3(req.file);        
        res.json({
            success: true,
            photoUrl
        });
    } catch (e){
        res.status(500).json({success:false, error:"Server error"});
    }
});

router.delete("/delete/picture", async(req,res) => {
    const pictureFileURL = await User.findByIdAndUpdate(req.user.id, {picture: ""} , {select:"picture"}).lean();   
    
    if(pictureFileURL.picture){
        const pictureFilePath = new URL(pictureFileURL.picture);
        const pictureFile = pictureFilePath.pathname.slice(1);

        try{
            await S3.deleteFromS3(pictureFile);
            res.json({
                success:true,
                error: "Picture is deleted"
            });
        }catch(err){
            res.status(500).json({success:false, error:"Server error"});
        }
    }else{
        res.json({
            success:true,
            error: "No picture"
        });
    }
    
});

router.get("/newmails", async(req, res) => {
    const emails = await Mail.find({receiver:req.user.id})
        .populate({path:"sender",select:{name:1,picture:1}})
        .sort({created_at:"desc"})
        .lean();

    res.json({
        emails
    });
});

router.put("/mail/status", async(req,res) => {
    try{
        await Mail.findByIdAndUpdate(req.body.id,{status:"read"});
        res.json({success:true});
    }catch(error){
        res.status(500).send("Server error");
    }    
});

router.delete("/mail/:id", async(req,res) => {
    try{
        await Mail.findByIdAndDelete(req.params.id);
        res.json({success:true});
    }catch(error){
        res.status(500).send("Server error");
    }
});

router.delete("/", async(req,res) => {
    const myUserId = req.user.id;

    try{
        await Mail.deleteMany({$or:[{sender:myUserId},{receiver:myUserId}]});
        await Friends.deleteMany({$or:[{to_id:myUserId,},{from_id:myUserId}]});
        const userPicture = await User.findByIdAndDelete(myUserId, {picture:1, _id:0}).lean();
        const travelPictures = await TravelPlace.find({user: myUserId}, {picture:1, _id:0}).lean();
        const pictures = [userPicture, ...travelPictures];
        await TravelPlace.deleteMany({user: myUserId});

        for(let item of pictures){
            const pictureFilePath = new URL(item.picture);
            const pictureFile = pictureFilePath.pathname.slice(1);
            await S3.deleteFromS3(pictureFile);
        }

        res.json({
            success: true,
            pictures
        })
    }catch(error){
        res.json({
            success:false,
            error: "Server error"
        })
    }
});


module.exports = router;