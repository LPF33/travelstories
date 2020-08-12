import React, {useContext} from "react";
import {AuthContext} from "../context/AuthContext";
import SlideAuth from "./SlideAuth";
import axios, {updateAxios} from "../config/axios";
import {useLocation, useHistory} from "react-router-dom";
import useFormValidation from "../customhooks/useFormValidation";

const initialState = {
    name: "",
    email: "",
    password: "",
    password2: ""
};

export default function Registration(){

    const {setToken} = useContext(AuthContext);
    const location = useLocation();
    const history = useHistory();

    const { handleChange, values, setValues, error, setError} = useFormValidation(initialState);

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(values.name && values.email && values.password && values.password2 && error.length===0){
            
            const check = await axios.post(`/api/auth/register`, values);
            if(check.data.success){         
                updateAxios(check.data.token);        
                window.localStorage.setItem("travelstories",check.data.token);
                window.localStorage.setItem("register",location.pathname);
                setToken(check.data.token);
                history.replace("/");
            }else{
                const {name,email} = check.data;
                setError(check.data.error);
                setValues({name,email,password:"",password2:""});
            }
        }else{
            setError(["Please fill out all fields"]);
        }
    };

    return(
        <div id="registration">
            <form onSubmit={handleSubmit}>
                <h1>Travel Stories <i className="fas fa-mountain"></i></h1>
                <h3>Share your stories <i className="fas fa-plane"></i></h3>
                <div>
                    {error.length>0 ? 
                        error.map((item,index) => <h3 key={index} className="error">{item}</h3>)
                        :
                        <h3>Or just rummage <i className="fas fa-search-location"></i></h3>
                    }    
                </div>
                <input type="text"  name="name" placeholder="Your Name" onChange={handleChange} value={values.name} autoComplete="off"/>
                
                <input type="text"  name="email" placeholder="Your email" onChange={handleChange} value={values.email} autoComplete="off"/>
                
                <input type="password"  name="password" placeholder="Your password" onChange={handleChange} value={values.password} autoComplete="off"/>
                
                <input type="password"  
                    name="password2" 
                    placeholder="Repeat password" 
                    onChange={handleChange} 
                    value={values.password2}
                    autoComplete="off"
                    onKeyDown={e => {
                        if(e.keyCode===13){
                            handleSubmit(e);
                        }
                    }}
                />
                <input type="submit" value="Register"/>
            </form>  
            <SlideAuth type="third" before="/welcome/login" after="/welcome"/> 
        </div>
    );
}