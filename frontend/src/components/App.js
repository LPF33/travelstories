import React from 'react';
import {Route, Switch, Redirect} from "react-router-dom";
import ThemeContextProvider from '../context/ThemeContext';
import MapContextProvider from '../context/MapContext';
import UserContextProvider from '../context/UserContext';
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
    return (
        <div> 
            <UserContextProvider>
                <ThemeContextProvider>
                    <MapContextProvider>                        
                        <Map />
                        <Switch>
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
                            <Route render={()=> <Redirect to="/" />}/>
                        </Switch>
                    </MapContextProvider>
                </ThemeContextProvider>
            </UserContextProvider>
        </div>                  
    );
};

export default App;
