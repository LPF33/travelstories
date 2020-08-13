import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import io from "socket.io-client";
import {AuthContext} from "./AuthContext";
import {UserContext} from "./UserContext";

export const SocketContext = createContext();

const SocketContextProvider = (props) => {

    const {token} = useContext(AuthContext);
    const {checkMails} = useContext(UserContext);

    const [stateOn, setStateOn] = useState({
        "update-users":false,
        "new-story":false
    });

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
        socket.current.on("update-users", () => {
            const change = !stateOn["update-users"];
            setStateOn({...stateOn, "update-users":change});
        });
        socket.current.on("new-story", () => {
            const change = !stateOn["new-story"];
            setStateOn({...stateOn, "new-story":change});
        });
    }

    const emit = (emittext) => {
        socket.current.emit(emittext);
    };

    useEffect(() => {
        initSocket(token);
    },[]);

    return (

        <SocketContext.Provider value={{emit, stateOn}}>
            {props.children}
        </SocketContext.Provider>
    )
}

export default SocketContextProvider;