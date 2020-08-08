import io from "socket.io-client";

let token = "";

let socket = io.connect("/");

const socketToken = token => {
    socket = io.connect("/", {query: {token}});

    socket.on("connect", () => {
        if(window.localStorage.getItem("register") === "/welcome/registration"){
            socket.emit("register");
            window.localStorage.removeItem("register");
        };
    })
}

export default socket;
export {socketToken};