import React, {useState, useEffect, useRef} from "react";
import {Link,Redirect} from "react-router-dom";

export default function SlideAuth(props){
    const {type, before, after} = props;
    let client_X = useRef(0);
    
    const [active, setActive] = useState({first:"",second:"",third:""});
    const [redir, setRedirect] = useState({redirect: false, path: ""});

    const keyboard = e => {
        if(e.keyCode === 37){
            setRedirect({redirect:true, path:before});
        }else if(e.keyCode === 39){
            setRedirect({redirect:true, path:after});
        }
    };

    const setTouch = e => {
        client_X.current = e.touches[0].clientX;
    };

    const handleTouch = e => {
        const dif = client_X.current - e.changedTouches[0].clientX;
        if(dif<-60){
            setRedirect({redirect:true, path:before});
        }else if(dif>60){
            setRedirect({redirect:true, path:after});
        }
    };

    useEffect(() => {
        setActive({...active, [type]:"active"});
        document.addEventListener("keydown",keyboard);
        document.addEventListener("touchstart",setTouch);
        document.addEventListener("touchend", handleTouch);

        return () => {
            document.removeEventListener("keydown", keyboard);
            document.removeEventListener("touchstart",setTouch);
            document.removeEventListener("touchend", handleTouch);
        };
    },[]);

    return(
        <div>
            {redir.redirect &&
                <Redirect to={redir.path}/>
            }
            {!redir.redirect &&
                <div id="slide-auth">
                    <Link to="/welcome"><div className={active.first}></div></Link>
                    <Link to="/welcome/login" ><div className={active.second}></div></Link>
                    <Link to="/welcome/registration"><div className={active.third}></div></Link>
                </div> 
            }
        </div>      
    );
}