import React, {useContext,useState,useEffect} from "react";
import {Link, useHistory} from "react-router-dom";
import {ThemeContext} from "../context/ThemeContext";
import {MapContext} from "../context/MapContext";
import {UserContext} from "../context/UserContext";
import axios from "../config/axios";
import {checkTitle, checkPictureFile, checkStory} from "../config/validation";

const EditStory = (props) => {

    const {storyid}  = props.match.params;
    const history = useHistory();

    const {coordinates, setCoordinates, formatAddress, setFormatAddress, updateStories} = useContext(MapContext);
    const {lightTheme, light, dark} = useContext(ThemeContext);
    const theme = lightTheme ? light : dark;
    const {userState, changeState} = useContext(UserContext);

    const [data, setData] = useState({title:"",address:"",status:"public",story:"",oldFile:""});
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let newStory = userState.editStory;
        const setDataStory = () => {
            setData({title : newStory.title, address : newStory.address, status: newStory.status, story: newStory.story, oldFile:newStory.picture});
            setCoordinates({longitude: newStory.location.coordinates[0], latitude: newStory.location.coordinates[1]});
            setFormatAddress(newStory.location.formattedAddress);
        };
        
        if(!userState.editStory){
            (async() => {
                const result = await axios.get(`/api/story/stories/${storyid}`);
                newStory = result.data.story;
                setDataStory();
            })();            
        }else{
            setDataStory();
        }
        
    },[]);

    const submit = async() => {
        const check = coordinates.longitude || data.address;

        if(data.title && data.status && data.story && check ){

            const titleCheck = checkTitle(data.title);
            if(!titleCheck[0]){
                setError(titleCheck[1]);
                return;
            }
            const storyCheck = checkStory(data.story);
            if(!storyCheck[0]){
                setError(storyCheck[1]);
                return;
            }
            setError("");
            const sendData = async(url=data.oldFile) => {
                const result = await axios.post(`/api/story/edit/${storyid}`,{
                    title: data.title,
                    status: data.status,
                    story: data.story,
                    address: data.address,
                    location: coordinates.longitude ? 
                        {   type:"Point",
                            coordinates:[coordinates.longitude, coordinates.latitude],
                            formattedAddress: formatAddress}
                        : "",
                    picture: url
                });
                if(result.data.success){
                    changeState("loading");
                    history.replace("/storyboard");
                }else{
                    changeState("loading");
                    setError("Server-Error");
                }
            };
            
            if(file){
                changeState("loading");
                const formData = new FormData();
                formData.append("file", file);
                formData.append("oldfile", data.oldFile);
                const result = await axios.post(`/api/story/pictureedit`,formData);
                if(result.data.success){
                    setFile(null);
                    updateStories();
                    sendData(result.data.photoUrl);
                }else{
                    changeState("loading");
                    setFile(null);
                    setError("Server-Error while picture upload!");
                }
            }else{
                changeState("loading");
                sendData();
            }                  
            
        }else{
            setError("Please fill in all fields!");
        }
    };

    const handleFileChange = e => {
        setFile(e.target.files[0]);
    };

    const checkFile = e => {
        const check = checkPictureFile(e);
        if(check[0]){
            setError("");
            setFile(e.target.files[0]);
        }else{
            setError(check[1]);
        }        
    };
    
    return(
        <div id="addstory" style={{background:theme.backGround, color:theme.text}}>
            <h1>Edit your story</h1>
            <form>
                <div>
                    <label >Title</label>
                    <input type="text" style={{background:theme.backGround, color:theme.text}} onChange={e => setData({...data, title:e.target.value})} value={data.title}/>
                </div>

                {coordinates.longitude && coordinates.latitude &&
                <div>
                    <div className="coordinates">
                        <h4>Coordinates:</h4>
                        <div className="clear" onClick={() => setCoordinates({longitude:"", latitude:""})}><i className="far fa-trash-alt"></i></div>
                    </div>
                    <h5>Longitude: {coordinates.longitude}</h5>
                    <h5>Latitude: {coordinates.latitude}</h5>
                    <h5>{formatAddress}</h5>
                </div>                
                }

                {!coordinates.longitude && !coordinates.latitude &&
                <div >
                    <label>Address</label>
                    <input type="text" style={{background:theme.backGround, color:theme.text}} onChange={e => setData({...data, address:e.target.value})}/>
                </div>
                }
                
                <div>
                    <label>Status</label>
                    <select id="status" style={{background:theme.backGround, color:theme.text}} onChange={e => setData({...data, status:e.target.value})} value={data.status}>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>                    
                </div>
                <div>
                    <label>Rewrite your travel story:</label>
                    <textarea style={{background:theme.backGround, color:theme.text}} onChange={e => setData({...data, story:e.target.value})} value={data.story}></textarea>
                </div>
                <div>
                    <label>Upload a new picture to your travel story:</label>
                    <input type="file" onChange={checkFile} />
                </div>
                {error && <div className="error">{error}</div>}
                <button type="button" style={{color:theme.text}} onClick={submit}>Submit</button>                
            </form>
            <Link to="/" className="close">X</Link> 
        </div>
    );
};

export default EditStory;