import React, {useContext} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import './Style/css/App.css';
import App from './components/App';
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import Registration from "./components/Registration";
import AuthContextProvider from "./context/AuthContext";
import {AuthContext} from "./context/AuthContext";

const Main = () => {
    
    const {token} = useContext(AuthContext);

    return(
        <Switch>
            {!token && <Redirect from="/" to="/welcome" exact/>}
            {token && <Redirect from="/welcome" to="/" exact/>}
            {token && <Redirect from="/welcome/login" to="/" exact/>}
            {token && <Redirect from="/welcome/registration" to="/" exact/>}
            {!token && <Route exact path="/welcome" component={Welcome}/>}
            {!token && <Route exact path="/welcome/login" component={Login}/>}
            {!token && <Route exact path="/welcome/registration" component={Registration} />}
            {token && <Route path="/" component={App}/>}
        </Switch>
    );
}

ReactDOM.render(
    <React.StrictMode>   
        <BrowserRouter> 
            <AuthContextProvider>             
                <Main/>            
            </AuthContextProvider>
        </BrowserRouter>   
    </React.StrictMode>,
    document.getElementById('root')
);