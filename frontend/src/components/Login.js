import React, {useState, useContext} from "react";
import {AuthContext} from "../context/AuthContext";
import {useHistory} from "react-router-dom";
import SlideAuth from "./SlideAuth";
import axios, {updateAxios} from "../config/axios";
import {socketToken} from "../config/client-socket";

export default function Login(){

    const {setToken} = useContext(AuthContext);
    const history = useHistory();

    const [data, setData] = useState({email:"",password:""});
    const [error, setError] = useState([]);

    const handleChange = e => {
        const newDate = {...data, [e.target.name]:e.target.value};
        setData(newDate);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(data.email && data.password){
            const check = await axios.post(`/api/auth/login`, data);
            if(check.data.success){
                updateAxios(check.data.token);
                window.localStorage.setItem("travelstories",check.data.token);
                socketToken(check.data.token);
                setToken(check.data.token);            
                
                history.replace("/");
            }else{
                setError(check.data.error);
                setData({email:"",password:""});
            }
        }else{
            setError(["Please fill out all fields"]);
        }
    };

    return(  
        <div id="login">
            <form onSubmit={handleSubmit}>
                <h1>Travel Stories <i className="fas fa-mountain"></i></h1>
                <div>
                    {error.length>0 ? 
                        error.map((item,index) => <h3 key={index} className="error">{item}</h3>)
                        :
                        <h3>Welcome and Start <i className="far fa-compass"></i></h3>
                    }    
                </div>                
                <input type="text"  name="email" placeholder="Your email" onChange={handleChange} value={data.email}/>
                <input type="password"  
                    name="password" 
                    placeholder="Your password" 
                    value={data.password}
                    onChange={handleChange}
                    autoComplete="off"
                    onKeyDown={e => {
                        if(e.keyCode===13){
                            handleSubmit(e);
                        }
                    }}
                />
                <input type="submit" value="Login"/>
            </form>              
            
            <SlideAuth type="second" before="/welcome" after="/welcome/registration"/>
        </div>
    );
}