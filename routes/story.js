const express = require("express");
const router = express.Router();
const TravelPlace = require("../models/location");
const uploader = require("../config/multer");
const S3 = require("../config/S3");
const authJWT = require("../middleware/auth");

router.use(authJWT);

router.post("/add", async(req,res) => {
    try{
        req.body.user = req.user.id;
        await TravelPlace.create(req.body);
        res.json({
            success:true
        });
    }catch(err){
        res.status(500).json({success:false});
    }
});

router.post("/add/picture", uploader.single("file"), async(req,res) => {
    const photoUrl = S3.getBucketURL(req.file.filename);

    try {
        await S3.uploadToS3(req.file);        
        res.json({
            success: true,
            photoUrl
        });
    } catch (e){
        res.status(500).send("Server Error");
    }
});

router.post("/edit/:storyid", async(req,res) => {
    
    try{
        await TravelPlace.updateOne({_id : req.params.storyid},req.body,{runValidators:true});
        res.json({
            success:true
        });
    }catch(err){
        res.status(500).json({success:false, error:err});
    }
});

router.post("/pictureedit", uploader.single("file"), async(req,res) => {
    const photoUrl = S3.getBucketURL(req.file.filename);
    let pictureFile = "";
    if(req.body.oldfile){
        const pictureFileURL = new URL(req.body.oldfile);
        pictureFile = pictureFileURL.pathname.slice(1);
    }

    try {
        await S3.uploadToS3(req.file);    
        if(pictureFile){
            await S3.deleteFromS3(pictureFile);
        }        
        res.json({
            success: true,
            photoUrl
        });
    } catch (err){
        res.status(500).send("Server Error");
    }
});

router.get("/mystories", async(req,res) => {
    try{
        const stories = await TravelPlace.find({user: req.user.id})
            .populate("user","name")
            .sort({created_at: "desc"})
            .limit(20)
            .lean();

        res.json({
            success: true,
            stories
        });
    }catch(err){
        res.status(500).send("Server Error");
    }
});

router.get("/stories", async(req,res) => {
    try{
        const stories = await TravelPlace.find({status: "public"})
            .populate("user","name")
            .sort({created_at: "desc"})
            .limit(20)
            .lean();

        res.json({
            success: true,
            stories
        });
    }catch(err){
        res.status(500).send("Server Error");
    }
});

router.get("/allstories", async(req,res) => {
    try{
        const stories = await TravelPlace.find({ $or:[{status: "public"},{user: req.user.id, status:"private"}] })
            .populate("user","name")
            .sort({created_at: "desc"})
            .limit(20)
            .lean();

        res.json({
            success: true,
            stories
        });
    }catch(err){
        res.status(500).send("Server Error");
    }
});

router.get("/stories/:id", async(req,res) => {
    try{
        const story = await TravelPlace.findById(req.params.id).populate("user","name").lean();

        res.json({
            success: true,
            story
        });
    }catch(err){
        res.status(500).send("Server Error");
    }
});

router.get("/user/:id", async(req,res) => {
    const {id} = req.params;
    try{
        const stories = await TravelPlace.find({user: id, status: "public"})
            .populate("user","name")
            .sort({created_at: "desc"})
            .limit(20)
            .lean();

        res.json({
            success: true,
            stories
        });
    }catch(err){
        res.status(500).send("Server Error");
    }
});

router.delete("/delete", async(req,res) => {
    const {id,pictureFile} = req.query;
    try{
        await TravelPlace.deleteOne({_id: id});
        if(pictureFile){
            await S3.deleteFromS3(pictureFile);
        }        
        res.json({
            success:true
        });
    }catch(err){
        res.status(500).send("Server Error");
    }
});


module.exports = router;