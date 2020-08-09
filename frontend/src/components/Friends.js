import React, {useState, useEffect, useContext} from "react";
import {useLocation, Link} from "react-router-dom";
import {UserContext} from "../context/UserContext";
import {ThemeContext} from "../context/ThemeContext";
import Searchbar from "./Searchbar";
import axios from "../config/axios";
import socket from "../config/client-socket";

const Friends = () => {

    const location = useLocation();
    const placeholderIMG = "/pictures/placeholder.png";
    let locationPath = location.pathname === "/users";

    const {userState} = useContext(UserContext);
    const {lightTheme, light, dark} = useContext(ThemeContext);
    const theme = lightTheme ? light : dark;

    const [users, setUsers] = useState([]);

    useEffect(() => {
        locationPath = location.pathname === "/users";
        setUsers(userState.search);             
    },[location, userState.search]);

    return(
        <div id="friendsboard" style={{background:theme.backGround}}>

            <div className="header" style={{background:theme.backGround}}>
                <h2>{locationPath ? "Users:" : "Your Friends"}</h2>
                <div className="searchbar"><Searchbar useCase={locationPath ? "users" : "friends"}/></div>
            </div>

            <div className="board">
                {users.length>0 && users.map(item => {
                    return (<div key={item._id}>
                        <img src={item.picture ? item.picture : placeholderIMG} alt="profile-picture"></img>
                        <h2>{item.name}</h2>
                        <Selectbar user={item}/>
                    </div>);
                })}
                {users.length===0 && <div className="no-found">Nothing found!</div>}
            </div>
            
            
            <Link to={locationPath ? "/friends" : "/users"}>
                <div className="link">
                    {locationPath ? <i className="fas fa-users icon"></i> : <i className="far fa-id-badge icon"></i>}
                </div> 
            </Link>

            <div className="whiteline" style={{background:theme.backGround}}></div>
        </div>
    );
};

export default Friends;

const Selectbar = (props) => {
    const {user} = props;
    const {userState} = useContext(UserContext);

    const check = user._id === userState.user._id ? true : false;

    return(
        <div className="select-bar">
            <div>
                <Link to={!check ? `/storyboard/${user._id}` : `/storyboard`} className="user icon"><i className="fas fa-user"></i></Link>
                {!check && <FriendButton otherUserId={user._id}/>}
                {!check && <div className="game icon"><i className="fas fa-gamepad"></i></div>}            
            </div>
            {!check && <div className="video icon"><i className="fas fa-video"></i></div>}
            {!check && <Link to={`/sendmessage/${user._id}/${user.name}`} className="icon"><i className="fas fa-pencil-alt"></i></Link>}
        </div>
    );
};

const FriendButton = (props) => {

    const status_NoRequest = "no-request";
    const status_Request_Accepted = "request-accepted";
    const status_Request_MadeByOther = "request-made-by-other";
    const status_Request_MadeByMe = "request-made-by-myself";

    const {otherUserId} = props;
    const [status,setStatus] = useState("no-request");

    useEffect( () => {
        (async () => {
            const newStatus = await axios.get(`/api/friends/checkfriendstatus/${otherUserId}`);
            setStatus(newStatus.data.status);
        })();
    },[]);

    function sendRequest(){
        (async () => {
            const newStatus = await axios.post(`/api/friends/crudfriendstatus/${otherUserId}/${status}`);
            socket.emit("check-mail");
            setStatus(newStatus.data.status);
        })();
    }
 
    if(status == status_NoRequest){
        return(
            <button className="getFriends friendbutton" onClick={sendRequest}><i className="fas fa-user-friends"></i></button>
        );
    } else if(status == status_Request_Accepted){
        return(
            <button className="getFriends friendbutton" style={{backgroundColor: "green"}} onClick={sendRequest}><i className="fas fa-user-times"></i></button>
        );
    } else if(status == status_Request_MadeByMe){
        return(
            <button className="getFriends friendbutton" style={{backgroundColor: "red"}} onClick={sendRequest}><i className="fas fa-users-slash"></i></button>
        );
    } else if(status == status_Request_MadeByOther){
        return(
            <button className="getFriends friendbutton" style={{backgroundColor: "red"}} onClick={sendRequest}><i className="fas fa-user-check"></i></button>
        );
    }
}; 

export {FriendButton, Selectbar} ;