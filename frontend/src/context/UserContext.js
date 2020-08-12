import React, {createContext, Component} from "react";
import axios from "../config/axios";

export const UserContext = createContext();

export default class UserContextProvider extends Component{

    constructor(props){
        super(props);
        this.state = {
            user: {},
            deleteStatus : "",
            editStory : null,
            messages : [],
            loading: false,
            search:[],
            mailId:""
        };
    }

    loadUser = async() => {   
        const result = await axios.get(`/api/user`);
        if(!result.data.success){
            window.localStorage.removeItem("travelstories");
            window.location.replace("/welcome");
        }else{
            this.setState({user : result.data.user});
        }        
    }

    changeState = (item,data) => {
        switch(item){
                        case "user": this.setState({user : data}); break;
                        case "deleteStatus": this.setState({deleteStatus : data}); break;
                        case "editStory": this.setState({editStory : data}); break;
                        case "messages": this.setState({messages: data}); break;
                        case "loading": this.setState({loading: this.state.loading ? false : true}); break;
                        case "search": this.setState({search: data}); break;
                        case "mailId": this.setState({mailId:data});break;  
                        default: break;
        }   
    }
    
    checkMails = async() => {
        const result = await axios.get(`/api/user/newmails`);
        this.setState({messages:result.data.emails});
    }   

    componentDidMount = () => {     
        this.loadUser();
        this.checkMails();
    }   

    render(){
        const userState = this.state;
        const {changeState, loadUser, checkMails} = this;    

        return(
            <UserContext.Provider value={{userState, changeState, loadUser, checkMails}}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}