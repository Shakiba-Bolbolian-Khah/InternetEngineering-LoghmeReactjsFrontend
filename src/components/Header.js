import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import '../CSS/Normalize.css';
import '../CSS/headerStyles.css';
import '../CSS/basicStyles.css';
import '../CSS/ModalsStyles.css'
import '../media/FlatIcon/font/flaticon.css';
import Home from "../containers/HomeContainers/Home"
import Profile from "../containers/Profile"
import Authentication from "../containers/Authentication"

class Header extends React.Component {
    goHome(event){
        event.preventDefault();
        ReactDOM.render(<Home />, document.getElementById("root"));
    }
    goProfile(event){
        event.preventDefault();
        ReactDOM.render(<Profile />, document.getElementById("root"));
    }
    logout(event){
        event.preventDefault();
        ReactDOM.render(<Authentication type = {"signup"} />, document.getElementById("root"));
    }    
    render(){
        return (
            <div className="row header">
                <div className="headerLeftSide">
                    <div className="exitContainer">
                        <a className="exit" href="#" onClick={(e) => this.logout(e)}>خروج</a>
                    </div>
                    {this.props.value !== "profile" &&
                        <div className="userProfileContainer">
                            <a className="userProfile" href="#" onClick={(e) => this.goProfile(e)}>حساب کاربری</a>
                        </div>
                    }
                    <div className="cartIconContainer">
                        <a href="#" onClick={(e) => this.showCart(e)}>
                            <i className="flaticon-loghme-smart-cart"></i>
                        </a>
                    </div>
                </div>
                {this.props.value !== "home" &&
                    <div className="LoghmeLogoContainer">
                        <a href="#" onClick={(e) => this.goHome(e)}>
                            <img className="LoghmeLogo" src={require('../media/Pics/LOGO.png')} alt="logo"/>
                        </a>
                    </div>
                }
            </div>
        )
    }
}

export default Header;