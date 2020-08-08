import React, {useState, useEffect, useContext, useRef} from "react";
import {UserContext} from "../context/UserContext";
import axios from "../config/axios";

const Searchbar = (props) => {

    const {useCase} = props;

    const {changeState} = useContext(UserContext);

    const [search, setSearch] = useState("");

    useEffect(() => {
        setSearch("");
    },[useCase]);

    useEffect(() => {
        let ignore = false;

        (async () => {
            let result;
            if(!search){
                result = await axios.get(`/api/friends/load${useCase}/all`);
            }else {
                result = await axios.get(`/api/friends/load${useCase}/${search}`);
            }

            if(!ignore && result.data.success){ 
                changeState("search", result.data.users);
            } else {
                changeState("search", []);
            }                              
        })();

        return () => {
            ignore = true;
        };         

    },[search, useCase]);    

    return(
        <div id="searchbar">
            <input 
                type="text" 
                id="search" 
                placeholder={`Search for ${useCase}`}
                onChange={e => setSearch(e.target.value)}
                value={search}/>
        </div>
        
    );
};

export default Searchbar;

const Mailsearch = () => {

    const [search, setSearch] = useState(""); 
    const [inputText, setInput] = useState("");

    const {changeState} = useContext(UserContext);  
    
    const hide = useRef(true);

    useEffect(() => {
        let ignore = false;

        (async () => {
            let result = await axios.get(`/api/friends/loadusers/${inputText}`);
            if(!ignore && result.data.success){ 
                setSearch(result.data.users);
            } else {
                setSearch("");
            }                              
        })();

        return () => {
            ignore = true;
        };         

    },[inputText]); 

    return(
        <div id="mailsearch">
            <input 
                type="text" 
                id="search" 
                placeholder="Find user"
                onChange={e => setInput(e.target.value)}
                value={inputText}
                onClick={() => hide.current = true}
            />
            {search && search.length>0 && hide.current &&
            <div id="output">
                {search.map((item,index) => {
                    return (<div key={index} 
                        className="select" 
                        onClick={() => {
                            changeState("mailId",item._id);
                            setInput(item.name);
                            setSearch("");
                            hide.current = false;
                        }
                        }>{item.name}</div>);
                })}
            </div>
            }
            {search && search.length===0 && hide.current && <div id="output">No users found!</div>}
        </div>
        
    );
};

export {Mailsearch};