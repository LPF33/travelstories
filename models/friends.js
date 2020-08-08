const mongoose = require("mongoose");

const FriendsSchema = new mongoose.Schema({

    from_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    to_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    accepted:{
        type:Boolean,
        default: false
    },
    created_at:{
        type:Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Friends", FriendsSchema);