import React, {useContext} from 'react';
import {Route, Switch, Redirect} from "react-router-dom";
import ThemeContextProvider from '../context/ThemeContext';
import MapContextProvider from '../context/MapContext';
import UserContextProvider from '../context/UserContext';
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
        <div> 
            <Switch>
                {!token && <Redirect from="/" to="/welcome" exact/>}
                {token && <Redirect from="/welcome" to="/" exact/>}
                {!token &&
                <div id="authentication">
                    <img src="/pictures/mountain.JPG" alt="mountain"></img>
                    <div>
                        <Route exact path="/welcome" component={Welcome}/>
                        <Route exact path="/welcome/login" component={Login}/>
                        <Route exact path="/welcome/registration" component={Registration} />
                    </div>            
                </div> 
                }
                {token && 
                <UserContextProvider>
                    <ThemeContextProvider>
                        <MapContextProvider>                        
                            <Map />
                            <Route exact path="/addstory" component={AddStory}/>
                            <Route exact path="/storyboard" component={Storyboard}/>
                            <Route exact path="/storyboard/:otheruser" component={Storyboard}/>
                            <Route path="/story/edit/:storyid" component={EditStory}/>
                            <Route path="/readstory/:storyid" component={ReadStory}/>
                            <Route exact path="/account" component={Account}/>
                            <Route exact path="/messages" component={Messages}/>
                            <Route exact path="/sendmessage" component={SendMessage}/>
                            <Route exact path="/sendmessage/:userid/:name" component={SendMessage}/>
                            <Route exact path="/friends" component={Friends}/>
                            <Route exact path="/users" component={Friends}/>                    
                        </MapContextProvider>
                    </ThemeContextProvider>
                </UserContextProvider>            
            }
            </Switch>
        </div>                  
    );
};

export default App;
