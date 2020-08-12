import React, {useContext} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import ThemeContextProvider from '../context/ThemeContext';
import MapContextProvider from '../context/MapContext';
import UserContextProvider from '../context/UserContext';
import SocketContextProvider from '../context/SocketContext';
import {AuthContext} from "../context/AuthContext";
import Login from "./Login";
import Welcome from "./Welcome";
import Registration from "./Registration";
import Map from './Map';
import AddStory from './AddStory';
import Storyboard from './Storyboard';
import EditStory from './EditStory';
import ReadStory from './ReadStory';
import Account from './Account';
import Messages from './Messages';
import Friends from './Friends';
import SendMessage from './SendMessage';

const App = () => {

    const {token} = useContext(AuthContext);

    return (
        <BrowserRouter>   
            <Switch>       
                {!token && <Redirect from="/" to="/welcome" exact/>}
                {token && <Redirect from="/welcome" to="/" exact/>}
                {!token &&   
                    <Route 
                        path="/welcome"
                        render={({match : {path}}) => {
                            return(
                                <div id="authentication">
                                    <img src="/pictures/mountain.JPG" alt="mountain"></img>
                                    <div>    
                                        <Switch>                    
                                            <Route exact path={path} component={Welcome}/>
                                            <Route exact path={`${path}/login`} component={Login} />
                                            <Route exact path={`${path}/registration`} component={Registration} />
                                            <Route exact path={`${path}/*`} render={() => <Redirect to="/welcome"/>}/>
                                        </Switch>    
                                    </div>            
                                </div>)
                        }} 
                    />
                }

                {token && 
                    <Route 
                        path="/"
                        render={({match : {path}}) => {
                            return(
                                <UserContextProvider>
                                    <SocketContextProvider>                                    
                                        <ThemeContextProvider>
                                            <MapContextProvider>                        
                                                <Map />
                                                <Switch>
                                                    <Route exact path={`${path}addstory`} component={AddStory}/>
                                                    <Route exact path={`${path}storyboard`} component={Storyboard}/>
                                                    <Route exact path={`${path}storyboard/:otheruser`} component={Storyboard}/>
                                                    <Route exact path={`${path}story/edit/:storyid`} component={EditStory}/>
                                                    <Route exact path={`${path}readstory/:storyid`} component={ReadStory}/>
                                                    <Route exact path={`${path}account`} component={Account}/>
                                                    <Route exact path={`${path}messages`} component={Messages}/>
                                                    <Route exact path={`${path}sendmessage`} component={SendMessage}/>
                                                    <Route exact path={`${path}sendmessage/:userid/:name`} component={SendMessage}/>
                                                    <Route exact path={`${path}friends`} component={Friends}/>
                                                    <Route exact path={`${path}users`} component={Friends}/> 
                                                    <Route path="/*" render={() => <Redirect to="/"/>}/>
                                                </Switch>                        
                                            </MapContextProvider>
                                        </ThemeContextProvider>
                                    </SocketContextProvider>
                                </UserContextProvider> 
                            ) 
                        }}
                    />                      
                }
            </Switch> 
        </BrowserRouter> 
    );
};

export default App;
