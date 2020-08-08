import React, {createContext, useState, useEffect} from "react";
import {getToken} from "../config/axios";
import {socketToken} from "../config/client-socket";

export const AuthContext = createContext();

export default function AuthContextProvider(props){

    const [token, setToken] = useState(null);

    const logout = async() => {        
        window.localStorage.removeItem("travelstories");
        window.location.replace("/");
    };

    useEffect(() => {
        if(token){
            let jwt;
            try{
                jwt = JSON.parse(atob(token.split('.')[1]));
                if(jwt.exp && (Date.now()>jwt.exp*1000)){
                    logout();
                }else{
                    const time = jwt.exp*1000-Date.now();
                    console.log(time);
                    setTimeout(() => logout(),time);
                }
            }catch(err){
                logout();
            }

            getToken(token);
            
        }else if(window.localStorage.getItem("travelstories")){
            getToken(window.localStorage.getItem("travelstories"));
            setToken(window.localStorage.getItem("travelstories"));
        }
        
    },[token]);

    return(
        <AuthContext.Provider value={{token, setToken, logout}}>
            {props.children}
        </AuthContext.Provider>
    );
}