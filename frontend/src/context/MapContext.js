import React , {useState, createContext, useEffect, useContext} from "react";
import {UserContext} from "./UserContext";
import {SocketContext} from "../context/SocketContext";
import axios from "../config/axios";

export const MapContext = createContext();

export default function MapContextProvider(props){

    const {userState} = useContext(UserContext);
    const {stateOn} = useContext(SocketContext);

    const [coordinates, setCoordinates] = useState({longitude:"", latitude:""});
    const [formatAddress, setFormatAddress] = useState("");
    const [allStories, setAllStories] = useState([]);

    const [goto, setGoto] = useState({longitude:"", latitude:""});

    const updateStories = async() => {
        const data = await axios.get(`/api/story/allstories`);
        const result = data.data.stories.map(story => {
            return{
                type:"Feature",
                geometry:{
                    type:"Point",
                    coordinates: [story.location.coordinates[0],story.location.coordinates[1]]
                },
                properties:{
                    title: story.title.slice(0,15),
                    link: `/readstory/${story._id}`,
                    icon: "beach"
                }
            };
        });
        setAllStories(result);
    }

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                setGoto({longitude:position.coords.longitude,latitude:position.coords.latitude});
            });
        } else {
          return;
        }
    }

    useEffect(() => {
        console.log("update");
        updateStories();  
    },[userState.deleteStatus,stateOn["new-story"]]);

    useEffect(() => {  
        getUserLocation();
    },[]);
    
    useEffect(() => {
        if(coordinates.longitude && coordinates.latitude){
            (async() => {
                const result = await axios.post(`/api/map/coordinates`, coordinates);                
                setFormatAddress(result.data.loc[0].formattedAddress);
            })();            
        }
    },[coordinates]);

    return(
        <MapContext.Provider value={{coordinates, setCoordinates, formatAddress, setFormatAddress, goto, setGoto, allStories, updateStories}}>
            {props.children}
        </MapContext.Provider>
    );
}