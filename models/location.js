const mongoose = require("mongoose");
const geocoder = require("../config/geocode");

const LocationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25
    },
    story: {
        type: String,
        required: true,
    },
    status:{
        type: String,
        default: "public",
        enum: ["public", "private"]
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    address:{
        type:String
    },
    location: {
        type: {
            type: String, 
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: "2dsphere"
        },
        formattedAddress:String
    },
    picture: {
        type: String
    },
    created_at:{
        type:Date,
        default: Date.now
    }
});

//Geocode & create location
LocationSchema.pre("save", async function(next){
    
    if(this.address){
        const loc = await geocoder.geocode(this.address);
        this.location={
            type:"Point",
            coordinates:[loc[0].longitude, loc[0].latitude],
            formattedAddress: loc[0].formattedAddress
        };

        //DO not save address
        this.address = null;
    }   
        
    next();   
});

LocationSchema.pre("updateOne", async function(next){
    
    if(this._update.address){
        const loc = await geocoder.geocode(this._update.address);
        this._update.location={
            type:"Point",
            coordinates:[loc[0].longitude, loc[0].latitude],
            formattedAddress: loc[0].formattedAddress
        };

        //DO not save address
        this._update.address = null;
    }   
        
    next();   
});

module.exports = mongoose.model("TravelPlace", LocationSchema);