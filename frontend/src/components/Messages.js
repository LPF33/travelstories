import React, {useState, useContext, useEffect} from "react";
import {Link} from "react-router-dom";
import {UserContext} from "../context/UserContext";
import {ThemeContext} from "../context/ThemeContext";
import {getDate, checkStory} from "../config/validation";
import axios from "../config/axios";

const Messages = () => {

    const {userState, checkMails} = useContext(UserContext);
    const {lightTheme, light, dark} = useContext(ThemeContext);
    const theme = lightTheme ? light : dark;

    const [messages, setMessages] = useState(userState.messages);
    const [mail, setMail] = useState(null);
    const [show, setShow] = useState("");

    useEffect(() => {
        setMessages(userState.messages);
    },[userState]);

    useEffect(() => {
        checkMails();
    },[]);

    const statusMail = async(id, status) => {
        if(status === "read"){
            return;
        }
        await axios.put(`/api/user/mail/status`, {id});
    };

    const deleteMail = async(id) => {
        const result = await axios.delete(`/api/user/mail/${id}`);
        if(result.data.success){
            setMail(null);
            checkMails();
        }
    };

    return(
        <div id="messages" style={{background:theme.backGround}}>
            <div >
                {messages.length>0 &&
                    <div className="heading"> Your Messages:
                        {messages.map((item,index) => 
                            <div key={index} 
                                className={`mail ${item.status==="new" ? "new" : ""}`} 
                                onClick={() => {
                                    setMail(item);
                                    setShow("block");
                                    statusMail(item._id, item.status);
                                    if(item.status==="new"){
                                        checkMails();
                                    }
                                }
                                }
                            >
                                <div>
                                    {item.kind==="normal" && item.sender.name}
                                    {item.kind!=="normal" && item.kind}
                                </div>
                            </div>)}
                    </div>
                }
            </div>
            {mail &&
            <div className={`readContainer ${show}`}>
                {mail.system && <div  className="read" dangerouslySetInnerHTML={{__html: `<h6>${getDate(mail.created_at)}</h6>${mail.message}`}}></div>}
                {!mail.system && 
                <div className="read">
                    <h6>{getDate(mail.created_at)}</h6>
                    {mail.message}
                </div>
                }
            </div>
            }
            <div onClick={() => setShow("")} ><i style={{background:theme.backGround, color:theme.text}} className={`fas fa-arrow-left ${show} arrow`}></i></div>
            <Link to="/" 
                className="close" 
                style={{background:theme.backGround, color:theme.text}}
                onClick={() => setShow("")}
            >X</Link>
            <div className="tools">
                <Link to="/sendmessage"><i className="fas fa-pencil-alt"></i></Link>
                {mail && <div className="trash" onClick={() => deleteMail(mail._id)}><i className="far fa-trash-alt"></i></div>}
                {mail && mail.kind!=="system" && <Link to={`/sendmessage/${mail.sender._id}/${mail.sender.name}`} className="answer"><i className="fas fa-redo"></i></Link>}
            </div>           

        </div>
    );
};

export default Messages;

const MessageAlert = ({linked}) => {
    const {userState} = useContext(UserContext);
    
    const [newMails, setNewMails] = useState(0);

    useEffect(() => {
        if(userState.messages.length>0){
            const num = userState.messages.reduce((value, item) => {              
                if(item.status === "new"){
                    return ++value;
                }else{
                    return value;
                }
            },0);
            setNewMails(num);
        }
    },[userState.messages]);

    return(
        <div>            
            {newMails>0 && 
            <div className="mail-container">
                <div className="circle"></div>
                {linked && <Link to="/messages" className="new-mails">{newMails}</Link>}
                {!linked && <div className="new-mails">{newMails}</div>}
            </div>            
            } 
        </div>               
    );
};

export {MessageAlert};