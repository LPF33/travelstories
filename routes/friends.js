const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Friends = require("../models/friends");
const Mail = require("../models/mail");
const SystemMessages = require("../config/systemmails");
const authJWT = require("../middleware/auth");

router.use(authJWT);

router.get("/loadusers/:search", async(req,res) => {
    const {search} = req.params;
    
    const users = search!== "all" ? await User.find({"name": new RegExp(search,'i')},{name:1 ,picture:1}).lean() :await User.find({},{name:1 ,picture:1}).lean();
    
    res.json({
        success:true,
        users
    });
});

router.get("/loadfriends/:search", async(req,res) => {
    const myUserId = req.user.id;
    const {search} = req.params;
    
    const getusers = search!== "all" ? 
        await Friends.find({$or:[{to_id:myUserId, accepted:true},{from_id:myUserId, accepted:true}]})
            .populate({path:"from_id",match:{_id:{$ne: myUserId},name:new RegExp(search,'i')},select:{name:1 ,picture:1}})
            .populate({path:"to_id",match:{_id:{$ne: myUserId},name:new RegExp(search,'i')},select:{name:1 ,picture:1}})
            .lean()
        :
        await Friends.find({$or:[{to_id:myUserId, accepted:true},{from_id:myUserId, accepted:true}]})
            .populate({path:"from_id",match:{_id:{$ne: myUserId}},select:{name:1 ,picture:1}})
            .populate({path:"to_id",match:{_id:{$ne: myUserId}},select:{name:1 ,picture:1}})
            .lean();
    
    const users = getusers.map(item => {
        if(item.to_id){
            return item.to_id;
        }else if(item.from_id){
            return item.from_id;
        }
    }).filter(item => item);

    res.json({
        success:true,
        users
    });
});

const status_NoRequest = "no-request";
const status_Request_Accepted = "request-accepted";
const status_Request_MadeByOther = "request-made-by-other";
const status_Request_MadeByMe = "request-made-by-myself";

router.get("/checkfriendstatus/:otherUserId", async(req, res) => {
    const myUserId = req.user.id;
    const {otherUserId} = req.params;

    const check = await Friends.find({$or:[{to_id:myUserId,from_id:otherUserId},{from_id:myUserId,to_id:otherUserId}]}).lean();
    
    if(check.length===0){
        res.json({
            status: status_NoRequest,
            check
        });
    } else if(check[0].accepted){
        res.json({
            status: status_Request_Accepted,
            check
        });
    } else if(check[0].from_id == myUserId ){
        res.json({
            status: status_Request_MadeByMe,
            check
        });
    } else {
        res.json({
            status: status_Request_MadeByOther
        });
    }    
});

router.post("/crudfriendstatus/:otherUserId/:status", async (req, res) => {
    const myUserId = req.user.id;
    const myName = req.user.name; 
    const {status,otherUserId} = req.params;
    const otherUserName = await User.findById(otherUserId,"name").lean();
    let newStatus;
    
    switch(status){
                    case status_NoRequest: 
                        await Friends.create({from_id:myUserId,to_id:otherUserId}); 
                        newStatus = status_Request_MadeByMe;
                        break;
                    case status_Request_Accepted: 
                        await Friends.deleteMany({$or:[{to_id:myUserId,from_id:otherUserId},{from_id:myUserId,to_id:otherUserId}]}); 
                        newStatus = status_NoRequest;
                        break;
                    case status_Request_MadeByMe: 
                        await Friends.deleteMany({$or:[{to_id:myUserId,from_id:otherUserId},{from_id:myUserId,to_id:otherUserId}]}); 
                        newStatus = status_NoRequest; 
                        break;
                    case status_Request_MadeByOther: 
                        await Friends.updateOne({to_id:myUserId,from_id:otherUserId},{accepted: true},{runValidators:true}); 
                        newStatus = status_Request_Accepted; 
                        break;        
    }
    try{
        const newMail = new Mail({receiver: otherUserId, sender: myUserId, message: SystemMessages.friendrequest(myName,newStatus,otherUserName.name), system: true, kind: "friendrequest"});
        await newMail.save();
        res.json({
            status: newStatus
        });

    }catch(error){
        res.json({
            status: newStatus,
            error
        });
    }  
});


router.post("/sendmessage" , async(req,res) => {
    try{
        await User.findById(req.body.receiver).lean();
        req.body.sender = req.user.id;
        await Mail.create(req.body);
        res.json({
            success:true
        });
    }catch(error){
        error.kind === "ObjectId" ?
            res.json({
                success: false,
                error: "This user does not exist"
            }) 
            :
            res.json({
                success: false,
                error: "Server error"
            });
    }
});

module.exports = router;