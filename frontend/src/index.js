import React from 'react';
import ReactDOM from 'react-dom';
import './Style/css/App.css';
import App from './components/App';
import AuthContextProvider from "./context/AuthContext";

ReactDOM.render(
    <React.StrictMode>  
        <AuthContextProvider>             
            <App/>            
        </AuthContextProvider>   
    </React.StrictMode>,
    document.getElementById('root')
);