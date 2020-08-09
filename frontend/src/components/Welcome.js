import React, {useState} from "react";
import SlideAuth from "./SlideAuth";

const text = {
    Search: "Find a destination", 
    Share:"Write an adventure story",
    Connect:"Make friends",
    Save:"Save all your favorite spots",
    Play:"Play some games together",
    Talk:"Just chat with anyone"
};

export default function Welcome(){
    return(
        <div id="welcome">
            <h1 className="headline">Travel Stories <i className="fas fa-mountain"></i></h1>
            <Card title="Search" icon="search" color="yellow" text={text.Search}/>
            <Card title="Share" icon="share-alt-square" color="rgb(250, 250, 198)" text={text.Share}/>
            <Card title="Connect" icon="network-wired" color="rgb(145, 126, 255)" text={text.Connect}/>
            <Card title="Save" icon="cloud" color="rgb(54, 197, 154)" text={text.Save}/>
            <Card title="Play"icon="play" color="rgb(255, 221, 126)" text={text.Play}/>
            <Card title="Talk" icon="users" color="rgb(255, 135, 126)" text={text.Talk}/>
            <SlideAuth type="first" before="/welcome/registration" after="/welcome/login"/>
        </div>
    );
}

function Card(props){
    const{title, icon, color, text} = props;

    const [flip, setFlip] = useState(""); 

    return(
        <div 
            className="card"             
            onMouseOver={() => setFlip("flip")} 
            onMouseLeave={() => setFlip("")}
        >
            <div className={`card-front ${flip}`} style={{"backgroundColor":color}} >
                <i className={`fas fa-${icon} icon`}></i>
                <p>{title}</p>
            </div >
            <div className={`card-back ${flip}`} style={{"backgroundColor":color}}>
                {text}
            </div>            
        </div>
    );
}