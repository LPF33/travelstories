const SystemMessages = require("../config/systemmails");
const Mail = require("../models/mail");

const IO = io => {    

    io.on("connection", socket => {

        const user = socket.decoded; 
        console.log(socket.id, "is connected");

        if(!socket.decoded){        
            return socket.disconnect(true);
        }    

        socket.on("register", async() => {
            const m = new Mail({receiver: user.id, message: SystemMessages.register(user.name), system: true, kind: "system"});
            await m.save();
            socket.emit("new-mail");
        });

        socket.on("check-mail", () => {
            io.sockets.sockets[socket.id].broadcast.emit("new-mail");
        });

        socket.on("update-users", () => {            
            io.sockets.sockets[socket.id].broadcast.emit("update-users");
        });

        socket.on("new-story", () => {            
            io.sockets.sockets[socket.id].broadcast.emit("new-story");
        });
    });
};

module.exports=IO;