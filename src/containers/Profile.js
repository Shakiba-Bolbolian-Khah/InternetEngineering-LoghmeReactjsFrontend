import React from 'react';
import PropTypes from 'prop-types';
import '../CSS/Normalize.css';
import '../CSS/headerStyles.css';
import '../CSS/basicStyles.css';
import '../CSS/footerStyles.css';
import '../CSS/infoBarStyles.css';
import '../CSS/profileStyles.css';
import '../CSS/ModalsStyles.css'
import '../media/FlatIcon/font/flaticon.css';
import Spinner from "../components/Spinner"
import Footer from "../components/Footer"
import Header from "../components/Header"
import InfoBar from "./InfoBar";
import InfoBox from "./InfoBox";

class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            user : "",
            ready: false,
        };
    }

    fetchUser(){
        const requestOptions = {
            method: 'GET'
        }
        fetch('http://localhost:8080/Loghme/users/0', requestOptions)
        .then(response => response.json())
        .then(data => {
            var updatedUser = data;
            this.setState({
                user : updatedUser,
                ready : true,
            })
        })
    }

    componentDidMount(){
        this.fetchUser()
        this.timerId = setInterval(
    		() => {this.fetchUser()}
    		, 1000
    	);
    }

    render(){ 
        if(this.state.ready){     
            return(
                <div className="container-fluid loghmeContainer bg">
                    <Header value = {"profile"}/>
                    <InfoBar type = {"profile"} value = {this.state.user} ready = {this.state.ready}/>
                    <InfoBox type = {"cart"} value = {this.state.user.orders} ready = {this.state.ready}/>
                    <Footer />
                </div>
            )
        }
        else{
            return(
                <div className="container-fluid loghmeContainer bg">
                    <Header value = {"profile"}/>
                    <div className="pt-5">
                        <Spinner/>
                    </div>
                </div>
            )
        }
    }
    
    componentWillUnmount(){
        clearInterval(this.timerId);
    }
}

Profile.propTypes = {
    user: PropTypes.object,
}

export default Profile;