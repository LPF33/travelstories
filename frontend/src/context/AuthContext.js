import React, {createContext, useState, useEffect, useRef} from "react";

export const AuthContext = createContext();

export default function AuthContextProvider(props){

    let timeoutId = useRef();

    const [token, setToken] = useState(null);

    const logout = async() => {       
        window.localStorage.removeItem("travelstories");
        clearTimeout(timeoutId.current);
        window.location.replace("/welcome");
    };

    useEffect(() => { 
        if(token){
            
            try{
                const jwt = JSON.parse(atob(token.split('.')[1]));
                if(jwt.exp && (Date.now()>jwt.exp*1000)){
                    logout();
                }else{                
                    const time = jwt.exp*1000-Date.now();
                    timeoutId.current = setTimeout(() => logout(),time);                    
                }
            }catch(err){
                logout();
            }           
            
        }else if(window.localStorage.getItem("travelstories")){
            setToken(window.localStorage.getItem("travelstories"));
        }

        return () => clearTimeout(timeoutId.current);
        
    },[token]);

    return(
        <AuthContext.Provider value={{token, setToken, logout}}>
            {props.children}
        </AuthContext.Provider>
    );
}