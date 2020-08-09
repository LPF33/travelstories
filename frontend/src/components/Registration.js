import React, {useState, useContext} from "react";
import {AuthContext} from "../context/AuthContext";
import SlideAuth from "./SlideAuth";
import axios, {updateAxios} from "../config/axios";
import {useLocation, useHistory} from "react-router-dom";
import {checkName, checkPassword, checkEmail} from "../config/validation";
import {socketToken} from "../config/client-socket";

export default function Registration(){

    const {setToken, setRegistred} = useContext(AuthContext);
    const location = useLocation();
    const history = useHistory();

    const [data, setData] = useState({name:"",email:"",password:"",password2:""});
    const [error, setError] = useState([]);

    const handleChange = e => {
        const newDate = {...data, [e.target.name]:e.target.value};
        setData(newDate);
    };

    const submit = async() => {
        if(data.name && data.email && data.password && data.password2){
            const saveError = [];
            
            const nameCheck = checkName(data.name);
            if(!nameCheck[0]){
                saveError.push(nameCheck[1]);
            }

            const emailCheck = checkEmail(data.email);
            if(!emailCheck[0]){
                saveError.push(emailCheck[1]);
            }        
            
            const passwordCheck = checkPassword(data.password);
            if(!passwordCheck[0]){
                saveError.push(passwordCheck[1]);
            }

            if(saveError.length>0){
                setError(saveError);
                return;
            }

            const check = await axios.post(`/api/auth/register`, data);
            if(check.data.success){         
                updateAxios(check.data.token);
                socketToken(check.data.token);         
                window.localStorage.setItem("travelstories",check.data.token);
                window.localStorage.setItem("register",location.pathname);
                setToken(check.data.token);
                history.replace("/");
            }else{
                const {name,email} = check.data;
                setError(check.data.error);
                setData({name,email,password:"",password2:""});
            }
        }else{
            setError(["Please fill out all fields"]);
        }
    };

    return(
        <div id="registration">
            <div>
                <h1>Travel Stories <i className="fas fa-mountain"></i></h1>
                <h3>Share your stories <i className="fas fa-plane"></i></h3>
                <div>
                    {error.length>0 ? 
                        error.map((item,index) => <h3 key={index} className="error">{item}</h3>)
                        :
                        <h3>Or just rummage <i className="fas fa-search-location"></i></h3>
                    }    
                </div>
                <input type="text"  name="name" placeholder="Your Name" onChange={handleChange} value={data.name}/>
                <input type="text"  name="email" placeholder="Your email" onChange={handleChange} value={data.email}/>
                <input type="password"  name="password" placeholder="Your password" onChange={handleChange} value={data.password}/>
                <input type="password"  
                    name="password2" 
                    placeholder="Repeat password" 
                    onChange={handleChange} value={data.password2}
                    onKeyDown={e => {
                        if(e.keyCode===13){
                            submit();
                        }
                    }}
                />
            </div>              
            <button type="button" onClick={submit}><h1>Registration</h1></button>
            <SlideAuth type="third" before="/welcome/login" after="/welcome"/> 
        </div>
    );
}