import React, {useContext,useState,useEffect} from "react";
import {Link, useHistory} from "react-router-dom";
import {UserContext} from "../context/UserContext";
import {StoryboardMenu} from "../components/Storyboard";
import axios from "../config/axios";

const ReadStory = (props) => {

    const history = useHistory();

    const {storyid}  = props.match.params;

    const {userState} = useContext(UserContext);

    const [read, setRead] = useState(userState.editStory);

    useEffect(() => {
        
        if(!userState.editStory){
            (async() => {
                const result = await axios.get(`/api/story/stories/${storyid}`);
                setRead(result.data.story);
            })();            
        }
        
    },[]);

    return(
        <div>
            {read &&
            <div id="read-story">
                <img src={read.picture} alt="picture"/>
                <div className="content">
                    <h3 className="box1">{read.title}</h3>
                    <div className="box2">
                        <h4>Location:</h4>
                        <h5>{read.location.formattedAddress}</h5>
                        <h5>longitude: {read.location.coordinates[0]}</h5>
                        <h5>latitude: {read.location.coordinates[1]}</h5>
                    </div>
                    
                    <p className="box3">{read.story}</p>
                    {read.user.name && <h4 className="box4">{read.user.name}</h4>}
                </div>
                <Link to="/" className="close">X</Link>
                <StoryboardMenu user={read.user._id} coordinates={read.location.coordinates} picture={read.picture} story={read} read={true}/>
            </div>
            }
            {!read && 
                <div>Loading</div>
            }
        </div>
    );

};

export default ReadStory;