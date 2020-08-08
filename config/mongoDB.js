const mongoose = require("mongoose");

const connectDB = async() => {
    try{
        const connection = await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser:true,
            useCreateIndex:true,
            useFindAndModify:false,
            useUnifiedTopology:true
        });
        console.log(`Mongodb connected: ${connection.connection.host}`);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDB;