import React , {useState, createContext} from "react";

export const ThemeContext = createContext();

export default function ThemeContextProvider(props){
    const [lightTheme, setLightTheme] = useState(true);
    const [light, setLight] = useState({
        text: "black", 
        backGround:"white", 
        map:"outdoors-v11", 
        picture:"/pictures/moon.png", 
        alt:"moon",
        hamburger:"/pictures/hamburgermenu.svg"}); 

    const [dark, setDark] = useState({
        text: "white", 
        backGround:"grey", 
        map:"dark-v10",
        picture:"/pictures/sun.png", 
        alt:"sun",
        hamburger:"/pictures/hamburgermenuwhite.png"}); 

    const changeMode = () => {
        setLightTheme(lightTheme ? false : true);
    };

    return(
        <ThemeContext.Provider value={{lightTheme, changeMode, light, dark}}>
            {props.children}
        </ThemeContext.Provider>
    );
}