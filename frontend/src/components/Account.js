import React, {useContext, useState, useEffect} from "react";
import {UserContext} from "../context/UserContext";
import {ThemeContext} from "../context/ThemeContext";
import {AuthContext} from "../context/AuthContext";
import {Link, useHistory} from "react-router-dom";
import axios from "../config/axios";
import {checkPictureFile, checkEmail, checkName, checkPassword} from "../config/validation";

const Account = () => {

    const history = useHistory();

    const {userState, loadUser, changeState} = useContext(UserContext);
    const {lightTheme, light, dark} = useContext(ThemeContext);
    const theme = lightTheme ? light : dark;
    
    const {logout} = useContext(AuthContext);

    const [data, setData] = useState({id:"",name:"",email:"",password:""});
    const [picture, setPicture] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setData({...data, id:userState.user._id, name:userState.user.name, email:userState.user.email});
    },[userState.user]);  
    
    const handleChange = e => {
        e.persist();
        setData({...data, [e.target.name]:e.target.value});
    };

    const submit = async() => {
        
        if(data.email===userState.user.email && data.name===userState.user.name && !picture && !data.password){
            setError("No changed data");
            return;
        }
        
        if(!data.email || data.email!==userState.user.email){
            const emailCheck = checkEmail(data.email);
            if(!emailCheck[0]){
                setError(emailCheck[1]);
                return;
            }
        }
        
        if(!data.name || data.name!==userState.user.name){
            const nameCheck = checkName(data.name);
            if(!nameCheck[0]){
                setError(nameCheck[1]);
                return;
            }
        }

        if(data.password){
            const passwordCheck = checkPassword(data.password);
            if(!passwordCheck[0]){
                setError(passwordCheck[1]);
                return;
            }
        }        

        const sendData = async(picture="") => {
            const result = await axios.post(`/api/user/update`, {...data, picture});
            if(result.data.success){
                loadUser();
                changeState("loading");
                history.replace("/");                
            }else{
                changeState("loading");
                setError(result.data.error);
            }
        };

        if(picture){
            changeState("loading");
            const formData = new FormData();
            formData.append("file",picture);
            const url = await axios.post(`/api/user/upload/picture`, formData);
            url.data.success ? sendData(url.data.photoUrl) : setError(url.data.error);
        }else{ 
            changeState("loading");       
            sendData();
        }
    };

    const deletePic = async() => {
        if(!userState.user.picture){
            setError("No picture");
            return;
        }
        changeState("loading");
        const result = await axios.delete(`/api/user/delete/picture`);
        if(result.data.success){
            changeState("loading");
            loadUser();
            setError(result.data.error);
        }else{
            changeState("loading");
            setError(result.data.error);
        }
    };

    const setFile = e => {
        const check = checkPictureFile(e);
        if(check[0]){
            setError("");
            setPicture(e.target.files[0]);
        }else{
            setError(check[1]);
        }        
    };

    const deleteAccount = async() => {
        changeState("loading");
        const result = await axios.delete("/api/user");
        if(result.data.success){
            changeState("loading");
            logout();
        }else{
            changeState("loading");
            setError(result.data.error);
        }
    };

    return(
        <div id="account" style={{background:theme.backGround, color:theme.text}}>            
            <div>
                <div>
                    <label>Change your name</label>
                    <input type="text" name="name" value={data.name} onChange={handleChange}/>
                </div>
                <div>
                    <label>Change your email</label>
                    <input type="text" name="email" value={data.email} onChange={handleChange}/>
                </div>
                <div>
                    <label>Change your password</label>
                    <input type="password" name="password" onChange={handleChange}/>
                </div>      
                <div>
                    <label>Upload a new picture</label>
                    <input type="file" name="picture" onChange={setFile}/>                    
                </div> 

                {error && <div className="error">{error}</div>}

                <button type="button" className="margin" onClick={submit}>Submit</button>

                <div className="margin">Delete Picture: 
                    <div onClick={deletePic} className="trash">
                        <i className="far fa-trash-alt"></i>
                    </div>
                </div>  

                <div className="margin" >Delete Account: 
                    <div onClick={deleteAccount} className="trash">
                        <i className="fas fa-user-alt-slash" ></i>
                    </div>
                </div> 
                
                <Link to="/" className="close">X</Link>       
            </div>           
        </div>
    );
};

export default Account;