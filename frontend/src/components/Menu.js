import React, {useContext, useState} from "react";
import {ThemeContext} from "../context/ThemeContext";
import {Link} from "react-router-dom";
import {UserContext} from "../context/UserContext";
import {AuthContext} from "../context/AuthContext";
import {MessageAlert} from "./Messages";

const Menu = () => {

    const {lightTheme, light, dark} = useContext(ThemeContext);
    const theme = lightTheme ? light : dark;

    const {userState} = useContext(UserContext);
    const {logout} = useContext(AuthContext);

    const [showMenu, setShowMenu] = useState("hide");

    return(
        <div id="Menu" >
            <img src={theme.hamburger} alt="hamburgermenu" onClick={() => setShowMenu(showMenu==="show" ? "hide" : "show")}></img>
            {showMenu==="hide" && <div className="alert"><MessageAlert linked={true}/></div>}
            
            <div id="menu-bar" className={showMenu} style={{background:theme.backGround, color:theme.text}}>
                <p className="user">{userState.user.name}{userState.user.picture && <img src={userState.user.picture} alt="userprofile"/>}</p>                
                <Link to="/" style={{color:theme.text}} onClick={() => setShowMenu("hide")}>Main</Link>
                <Link to="/messages" style={{color:theme.text}} onClick={() => setShowMenu("hide")}>Messages <MessageAlert /></Link>
                <Link to="/storyboard" style={{color:theme.text}} onClick={() => setShowMenu("hide")}>Storyboard</Link>
                <Link to="/friends" style={{color:theme.text}} onClick={() => setShowMenu("hide")}>Friends</Link>
                <Link to="/users" style={{color:theme.text}} onClick={() => setShowMenu("hide")}>Users</Link>
                <Link to="/account" style={{color:theme.text}} onClick={() => setShowMenu("hide")}>Account</Link>
                <button type="button" onClick={logout} style={{color:theme.text}}>Logout</button>
            </div>
        </div>        
    );
};

export default Menu;