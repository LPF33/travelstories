const mongoose = require("mongoose");

const MailSchema = new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    
    system:{
        type:Boolean,
        default: false
    },
    kind:{
        type:String,
        default: "normal",
        enum:["normal","friendrequest","system"]
    },
    message:{
        type:String,
        required:true,
        trim: true,
        maxlength: 3000
    },
    status:{
        type: String,
        default: "new",
        enum: ["read","new"]
    },
    created_at:{
        type:Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Mail", MailSchema);