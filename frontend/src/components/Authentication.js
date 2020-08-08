import React from "react";
import Login from "./Login";
import Welcome from "./Welcome";
import Registration from "./Registration";
import {Route} from "react-router-dom";

export default function Authentication(){

    return(
        <div id="authentication">
            <img src="/pictures/mountain.JPG" alt="mountain"></img>
            <div>
                <Route exact path="/welcome" component={Welcome}/>
                <Route exact path="/welcome/login" component={Login}/>
                <Route exact path="/welcome/registration" component={Registration} />
            </div>                                    
        </div>
    );
}