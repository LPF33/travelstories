import React, {useContext, useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {ThemeContext} from "../context/ThemeContext";
import {UserContext} from "../context/UserContext";
import {SocketContext} from "../context/SocketContext";
import axios from "../config/axios";
import {checkStory} from "../config/validation";
import {Mailsearch} from "./Searchbar";

const SendMessage = (props) => {

    const {userid, name} = props.match.params;

    const {lightTheme, light, dark} = useContext(ThemeContext);
    const theme = lightTheme ? light : dark;
    const {userState, changeState} = useContext(UserContext);
    const {emit} = useContext(SocketContext);

    const [mail, setMail] = useState({message:"",receiver:userid});
    const [error, setError] = useState("");

    const send = async() => {
        const mailCheck = checkStory(mail.message,"Mail");
        if(mail && mailCheck[0]){
            const result = await axios.post(`/api/friends/sendmessage`, mail);
            result.data.success ? setError("Mail was sent") : setError(result.data.error);
            emit("check-mail");
        }else{
            setError(mailCheck[1]);
        } 
    };

    useEffect(() => {
        if(userState.mailId){
            setMail({...mail, receiver:userState.mailId});
        }
    },[userState.mailId]);

    return(
        <div className="send-message">
            {name && <h3>Send a message to: {name}</h3>}
            {!name && 
            <div className="search">
                <h3>Send a message to:</h3> 
                <Mailsearch/>
            </div>
            }
            <textarea onFocus={() => setError("")} placeholder="Please, write here your mail!" value={mail.message} onChange={e => setMail({...mail,message:e.target.value})}></textarea>
            {!error && <button onClick={send}>Send</button>}
            <Link to="/" 
                className="close" 
                style={{background:theme.backGround, color:theme.text}}
            >X</Link>
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default SendMessage;