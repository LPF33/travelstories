import {useState} from "react";
import {checkName, checkPassword, checkEmail} from "../config/validation";

function useFormValidation(initialState){
    const [values, setValues] = useState(initialState);
    const [error, setError] = useState([]);

    const validateInput = (name,val) => {
            
        if(name === "name"){
            const nameCheck = checkName(val);
            if(!nameCheck[0]){
                setError([nameCheck[1]]);
            }else{
                setError([]);
            }
        }
        
        if(name === "email"){
            const emailCheck = checkEmail(val);
            if(!emailCheck[0]){
                setError([emailCheck[1]]);
            }else{
                setError([]);
            }
        }
        
        if(name === "password"){
            const passwordCheck = checkPassword(val);
            if(!passwordCheck[0]){
                setError([passwordCheck[1]]);
            }else{
                setError([]);
            }
        }       

        if(name === "password2"){
            const passwordCheck = checkPassword(values.password);
            if(values.password !== val){
                setError(["Your passwords do not match!"]);
            }else if(!passwordCheck[0]){
                setError([passwordCheck[1]]);
            }else{
                setError([]);
            }
        }
    }

    const handleChange = e => {
        setValues({...values, [e.target.name]:e.target.value});
        validateInput(e.target.name, e.target.value);
    }
    
    return {handleChange, values, setValues, error, setError};
}

export default useFormValidation;