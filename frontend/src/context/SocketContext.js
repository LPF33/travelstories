import React, {createContext, useContext, useEffect, useRef} from "react";
import io from "socket.io-client";
import {AuthContext} from "./AuthContext";
import {UserContext} from "./UserContext";

export const SocketContext = createContext();

const SocketContextProvider = (props) => {

    const {token} = useContext(AuthContext);
    const {checkMails, loadUser} = useContext(UserContext);

    const socket = useRef();

    const initSocket = validToken => {
        socket.current = io.connect("/", {query:{token: validToken}});

        socket.current.on("connect", () => {
            console.log("connected", socket.current.id);
            if(window.localStorage.getItem("register") === "/welcome/registration"){
                socket.current.emit("register");
                window.localStorage.removeItem("register");
            };
        })
    
        socket.current.on("new-mail", checkMails);
        socket.current.on("update-user", () => console.log("hhh"));
    }

    const emit = (emittext) => {
        socket.current.emit(emittext);
    };

    useEffect(() => {
        initSocket(token);
    },[]);

    return (
        <SocketContext.Provider value={{emit}}>
            {props.children}
        </SocketContext.Provider>
    )
}

export default SocketContextProvider;