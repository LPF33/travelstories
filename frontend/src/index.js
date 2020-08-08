import React, {useContext} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import './Style/css/App.css';
import App from './components/App';
import Authentication from "./components/Authentication";
import AuthContextProvider from "./context/AuthContext";
import {AuthContext} from "./context/AuthContext";

const Main = () => {
    
    const {token} = useContext(AuthContext);

    return(
        <BrowserRouter>
            {!token && <Redirect from="/" to="/welcome" exact/>}
            {token && <Redirect from="/welcome" to="/" exact/>}
            {!token && <Route path="/welcome" component={Authentication}/>}
            {token && <Route path="/" component={App}/>}
        </BrowserRouter>
    );
}

ReactDOM.render(
    <React.StrictMode>   
        <AuthContextProvider>    
            <Main/>
        </AuthContextProvider> 
    </React.StrictMode>,
    document.getElementById('root')
);