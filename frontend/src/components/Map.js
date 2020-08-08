import React, {useState, useEffect, useRef, useContext} from 'react';
import {Link, useHistory} from "react-router-dom";
import mapboxgl from "mapbox-gl";
import axios from "../config/axios";
import {ThemeContext} from "../context/ThemeContext";
import {MapContext} from "../context/MapContext";
import {UserContext} from "../context/UserContext";
import token from "../config/mapbox-token";
import Menu from './Menu';
import Loading from "./Loading";
mapboxgl.accessToken=token;   

const movePlus = (x,y) => {
    const elem = document.querySelector(".add-story-link");
    elem.style.top = y + "px";
    elem.style.left = x + "px";
    elem.style.transform = "translate(-50%,-50%)";
};

const Map = () => {

    const mapRef = useRef(null);
    const map = useRef(null);
    const mapDbClick = useRef({click:false, move:false});

    const history = useHistory();

    const {lightTheme, changeMode, light, dark} = useContext(ThemeContext);
    const theme = lightTheme ? light : dark;

    const {setCoordinates, goto, allStories} = useContext(MapContext);
    const {userState} = useContext(UserContext);

    const [mapData, setMapData] = useState({longitude:13,latitude:50,zoom:4});
    const [search, setSearch] = useState("");
    const [foundData, setFoundData] = useState([]);

    useEffect(() => {

        map.current = new mapboxgl.Map({
            container: mapRef.current,
            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            center: [mapData.longitude,mapData.latitude], // starting position [lng, lat]
            zoom: mapData.zoom // starting zoom
        });
        
        const moveMap = () => {

            setMapData({
                longitude: map.current.getCenter().lng.toFixed(4),
                latitude: map.current.getCenter().lat.toFixed(4),
                zoom: map.current.getZoom().toFixed(2)
            });
            if(mapDbClick.current.move && mapDbClick.current.click){
                movePlus(30,window.innerHeight-120);
                setCoordinates({longitude:"", latitude:""});
                mapDbClick.current = {click:false, move:false};
            }
        };

        const dblclickMap = e => {
            setCoordinates({longitude:e.lngLat.lng, latitude:e.lngLat.lat});
            movePlus(e.originalEvent.pageX, e.originalEvent.pageY);
            mapDbClick.current.click = true;
        };

        const moveendMap = () => {
            if(mapDbClick.current.click){
                mapDbClick.current.move = true;
            } 
        };

        const popupLink = e => {
            const link = e.features[0].properties.link;
            history.push(link);
        };

        map.current.on('move', moveMap);

        map.current.on("dblclick", dblclickMap);

        map.current.on("moveend", moveendMap);

        map.current.on("click", "places", popupLink);

        return () => {
            map.current.off('move', moveMap);

            map.current.off("dblclick", dblclickMap);

            map.current.off("moveend", moveendMap);

            map.current.off("click", "places", popupLink);
        };
    },[]);

    useEffect(() => {
        map.current.setStyle(`mapbox://styles/mapbox/${theme.map}`);
    },[lightTheme]);

    useEffect(() => {
        if(goto.longitude && goto.latitude){
            changeMap(goto.longitude, goto.latitude, 7);
        }
    },[goto]);

    useEffect(() => {

        const storeStories = () => {
            map.current.addLayer({
                id: "places",
                type: "symbol",
                source: {
                    type: "geojson",
                    data:{
                        type:"FeatureCollection",
                        features:allStories
                    }
                },
                layout:{
                    'icon-image': '{icon}-15',
                    'icon-size': 1.5,
                    'icon-allow-overlap': true,
                    'text-field':"{title}",
                    "text-font":["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-offset":[0, 0.9],
                    "text-anchor":"top"
                }
            });
        };

        map.current.on("load", storeStories);

        return () => map.current.off("load", storeStories);
    },[allStories]);

    const changeMap = (long, lat, zoom) => {
        map.current.setCenter([long, lat]);
        map.current.setZoom(zoom);
    };

    const findLocation = async(address=search) => {
        if(address){
            const loc = await axios.get(`/api/map/search/${address}`);
            changeMap(loc.data.loc[0].longitude,loc.data.loc[0].latitude,10);
            setMapData({longitude :loc.data.loc[0].longitude, latitude: loc.data.loc[0].latitude, zoom:10});
            setSearch(loc.data.loc[0].formattedAddress);
            const marker = new mapboxgl.Marker().setLngLat([loc.data.loc[0].longitude, loc.data.loc[0].latitude]).addTo(map.current);
            setFoundData(loc.data.loc);
            movePlus(window.innerWidth/2+20,window.innerHeight/2+20);
            setCoordinates({longitude:loc.data.loc[0].longitude, latitude:loc.data.loc[0].latitude});
            mapDbClick.current.click = true;
        }        
    };

    return (
        <div>
            <div id="search-bar" style={{background:theme.backGround, color:theme.text}}>
                <div className="icon" onClick={findLocation}><i className="fas fa-search-location"></i></div>
                <input type="text" 
                    placeholder="Search a location" 
                    value={search}
                    style={{background:theme.backGround, color:theme.text}}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => {if(e.keyCode===13){findLocation();}}}
                ></input>  
            </div>     
            {foundData.length>1 ? <div id="results">
                <div className="single-result-headline">Other places found:</div>
                {foundData.map((item,index)=> 
                    <div className="single-result" key={index} onClick={() => {setSearch(item.formattedAddress); findLocation(item.formattedAddress);}}>{item.formattedAddress}</div>)}</div> 
                : ""}       
            {foundData.length<=1 && 
            <div className='sidebarStyle' style={{background:theme.backGround, color:theme.text}}>
                <div>Longitude: {mapData.longitude} | Latitude: {mapData.latitude} | Zoom: {mapData.zoom}</div>
            </div>}
            <div id="map" ref={mapRef} className='mapContainer' onFocus={() => setFoundData([])}></div>             
            <img src={theme.picture} alt={theme.alt} onClick={changeMode} className="img-theme"></img>   
            <Menu />
            <Link to={`/addstory`} className="add-story-link">+</Link>
            {userState.loading && <Loading />}
        </div>
    );
};

export default Map;