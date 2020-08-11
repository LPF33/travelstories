const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const compression = require('compression');
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
const csurf = require("csurf");
const helmet = require('helmet');
const connectDB = require("./config/mongoDB");
const path = require("path");
const jwt = require('jsonwebtoken');

//Load config for process.env
dotenv.config({path: "./config/config.env"});

//Connect to MongoDB
connectDB();

//Initialize Express
const app = express();

//Static build file
app.use(express.static(path.join(__dirname + "/frontend/build")));

//CORS
const options = {origin: false, allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, csrf-token", credentials: true};
app.use(cors(options));

app.use(helmet.contentSecurityPolicy({
    directives:{
      defaultSrc:["'self'", "http://localhost:8080/"],
      scriptSrc:["'self'", "'unsafe-inline'",'cdnjs.cloudflare.com',"https://api.tiles.mapbox.com", "blob:","mapbox.com","https://api.mapbox.com/"],
      styleSrc:["'self'", "'unsafe-inline'",,'fonts.googleapis.com','fonts.gstatic.com','cdnjs.cloudflare.com',"https://api.tiles.mapbox.com","mapbox.com","https://api.mapbox.com/"],
      fontSrc:["'self'", "'unsafe-inline'",'fonts.googleapis.com','fonts.gstatic.com','cdnjs.cloudflare.com',"https://api.tiles.mapbox.com","mapbox.com","https://api.mapbox.com/"],
      "img-src": ["'self'", 'data:','https://api.mapbox.com/','https://imageboardlpf.s3.eu-central-1.amazonaws.com'],
      "connect-src":["'self'","mapbox.com","https://api.mapbox.com/",'https://events.mapbox.com/']
    }}));
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.use(express.json());
app.use(compression());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser())

//Csurf
app.use(csurf({cookie:true}));
app.use(function(req, res, next){
    res.cookie('csrftoken', req.csrfToken());
    next();
});

//Connect server with Socket.io
const server = require("http").createServer(app);
const io = require("socket.io")(server);
io.use(function(socket, next){
    if (socket.handshake.query && socket.handshake.query.token){
        jwt.verify(socket.handshake.query.token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
            if (err) {
                return next(new Error('Authentication error'));
            }
            socket.decoded = decoded;
            next();
      });
    }
    else {
        next(new Error('Authentication error'));
    }    
})
require("./WebSocket/server-socket")(io);

//Express Routing
app.use("/api/auth",require("./routes/auth"));
app.use("/api/map",require("./routes/map"));
app.use("/api/story",require("./routes/story"));
app.use("/api/user",require("./routes/user"));
app.use("/api/friends",require("./routes/friends"));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + "/frontend/build/index.html")); 
});


server.listen(process.env.PORT || 8080);
