import React, {useContext, useEffect, useState} from "react";
import {Link, useLocation, useHistory} from "react-router-dom";
import {ThemeContext} from "../context/ThemeContext";
import {UserContext} from "../context/UserContext";
import {MapContext} from "../context/MapContext";
import axios from "../config/axios";

const Storyboard = (props) => {

    const {otheruser} = props.match.params;

    const {lightTheme, light, dark} = useContext(ThemeContext);
    const theme = lightTheme ? light : dark;

    const {userState} = useContext(UserContext);
    const [stories, setStories] = useState([]);
    const [mystories, setMyStories] = useState([]);
    const [otherStories, setOtherStories] = useState([]);
    const [publicS, setPublic] = useState("public");

    useEffect(() => {
        otheruser ? setPublic("other") : setPublic("public");

        (async() => {
            const result = await axios.get(`/api/story/stories`);
            setStories(result.data.stories);
            const result2 = await axios.get(`/api/story/mystories`);
            setMyStories(result2.data.stories);

            if(otheruser){
                const result3 = await axios.get(`/api/story/user/${otheruser}`);
                setOtherStories(result3.data.stories);
            }
        })();
    },[userState.deleteStatus, otheruser]);


    return(
        <div id="storyboard" style={{background:theme.backGround}}>            
            <div className="headline" style={{background:theme.backGround, color:theme.text}}>Storyboard</div>
            <div className="body">
                <div>
                    <div className="public card" onClick={() => setPublic("public")}>Public</div>
                    <div className="mystory card" onClick={() => setPublic("mystory")}>My stories</div>
                    {otheruser && otherStories.length>0 && <div className="other card" onClick={() => setPublic("other")}>{otherStories[0].user.name}</div>}
                </div>                
                <div className={`stories ${publicS}`}>
                    {publicS === "public" 
                        &&
                        stories.map((item,index) => {
                            return(<div key={index} className="preview">
                                <img src={item.picture} alt="picture"/>
                                <h3>{item.title}</h3>
                                <h5>{item.location.formattedAddress}</h5>
                                <h6>{item.user.name}</h6>
                                <StoryboardMenu user={item.user._id} coordinates={item.location.coordinates} picture={item.picture} story={item}/>
                            </div>);
                        })
                    }
                    {publicS === "mystory"
                        &&
                        mystories.map((item,index) => {
                            return(<div key={index} className="preview">
                                <img src={item.picture} alt="picture"/>
                                <h3>{item.title}</h3>
                                <h5>{item.location.formattedAddress}</h5>
                                <StoryboardMenu user={item.user} coordinates={item.location.coordinates} picture={item.picture} story={item}/>
                            </div>);
                        })
                    }
                    {publicS === "other" 
                        &&
                        otherStories.map((item,index) => {
                            return(<div key={index} className="preview">
                                <img src={item.picture} alt="picture"/>
                                <h3>{item.title}</h3>
                                <h5>{item.location.formattedAddress}</h5>
                                <h6>{item.user.name}</h6>
                                <StoryboardMenu user={item.user._id} coordinates={item.location.coordinates} story={item}/>
                            </div>);
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default Storyboard;


const StoryboardMenu = (props) => {

    const location = useLocation();
    const history = useHistory();

    const {user, coordinates, picture, story, read} = props;
    const {userState, changeState} = useContext(UserContext);
    const {setGoto, updateStories} = useContext(MapContext);    

    const check = user === userState.user._id;

    const deleteStory = async() => {
        changeState("loading");
        let pictureFile = "";
        if(picture){
            const pictureFileURL = new URL(picture);
            pictureFile = pictureFileURL.pathname.slice(1);
        }        
        const result = await axios.delete(`/api/story/delete`, {params :{id:story._id, pictureFile}});
        if(result.data.success){
            changeState("loading");
            changeState("editStory",null);
            updateStories();
            changeState("deleteStatus" , Math.random()*100000);
            if(location.pathname.startsWith("/readstory")){
                history.replace("/");
            }
        }
    };

    return(
        <div className="storyboard-menu">
            {!read && <Link to={`/readstory/${story._id}`} onClick={() => changeState("editStory",story)} className="read-link"><i className="fas fa-glasses"></i></Link>}
            <Link to="/" className="link-location" onClick={() => setGoto({longitude:coordinates[0], latitude:coordinates[1]})}><i className="fas fa-map-marker-alt"></i></Link>
            {!check && <Link to={`/storyboard/${user}`}><i className="fas fa-user-alt"></i></Link>}
            {check && <Link to={`/story/edit/${story._id}`} onClick={() => changeState("editStory", story )} className="edit-link"><i className="far fa-edit"></i></Link>}
            {check && <div onClick={deleteStory}><i className="fas fa-trash-alt delete" ></i></div>}
        </div>
    );
};

export {StoryboardMenu};