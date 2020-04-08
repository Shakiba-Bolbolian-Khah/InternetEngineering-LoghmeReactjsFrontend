import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import './CSS/Normalize.css';
import './CSS/headerStyles.css';
import './CSS/basicStyles.css';
import './CSS/headerStyles.css';
import './CSS/footerStyles.css';
import './CSS/infoBarStyles.css';
import './CSS/profileStyles.css';
import './CSS/authenticationStyles.css';
import './media/FlatIcon/font/flaticon.css';
import './media/FlatIcon/font-signup/flaticon.css';
// link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css';


class Header extends React.Component {
    goHome(event){
        event.preventDefault();
        ReactDOM.render(<Home />, document.getElementById("root"));
    }

    goProfile(event){
        event.preventDefault();
        ReactDOM.render(<Profile />, document.getElementById("root"));
    }

    render(){
        return (
            <div className="row header">
                <div className="headerLeftSide">
                    <a className="exit" href="/">خروج</a>
                    {this.props.value !== "profile" &&
                        <a className="userProfile" href="#" onClick={(e) => this.goProfile(e)}>حساب کاربری</a>
                    }
                    <a href="#" onClick={(e) => this.showCart(e)}>
                        <i className="flaticon-smart-cart"></i>
                    </a>
                </div>
                {this.props.value !== "home" &&
                    <a href="#" onClick={(e) => this.goHome(e)}>
                        <img className="LoghmeLogo" src={require('./media/Pics/LOGO.png')} alt="logo"></img>
                    </a>
                }
            </div>
        )
    }
}

function Footer(){
    return (
        <div className="footer">
            &copy; تمامی حقوق متعلق به لقمه است.
        </div>
    )
}

String.prototype.toPersianDigits= function(){
    var id = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return this.replace(/[0-9]/g, function(w){
        return id[+w]
    });
}

class InfoBar extends React.Component {
    render(){
        if(this.props.type === "profile"){
            return(
                <div className="row infoBar">
                    <div className="infoBarUserDetails">
                        <div className="infoBarDetailData">
                            <i className="flaticon-phone"></i>
                            <div>{this.props.value.phoneNumber}</div>
                        </div>
                        <div className ="infoBarDetailData">
                            <i className="flaticon-mail"></i>
                            <div>{this.props.value.email}</div>
                        </div>
                        <div className="infoBarDetailData">
                            <i className="flaticon-card"></i>
                            <div>{String(this.props.value.credit).toPersianDigits()} تومان</div>
                        </div>
                    </div>
                    <div className="infoBarUsername">
                        <i className="flaticon-account"></i>
                        <div>{this.props.value.firstName} {this.props.value.lastName}</div>
                    </div>
                </div>
            )
        }
        else if(this.props.type === "restaurant"){
            return(
                <div className="row infoBar"></div>
                // {/* <div className="row justify-content-center">
                //     <img className="restaurantBigLogo borderShadow" src={(this.props.value.logo)}></img>
                // </div>
                // <div className="row justify-content-center">
                //     <div className="restaurantBigName">{this.props.value.name}</div>
                // </div> */}
            )
        }
        else{
            return("")
        }
    }
}

class SelectBar extends React.Component{
    handleClick(event, page){
        event.preventDefault();
        ReactDOM.render(<InfoBox type = {page} />, document.getElementById("infoBox"));
    }

    render(){
        if(this.props.value === "cart"){
            return(
                <div className="selectBar">
                    <a className="orderButtonCart rounded-right" href="#" onClick={(e) => this.handleClick(e, "order")}>
                        سفارش&zwnj;ها
                    </a>
                    <a className="increaseButtonCart rounded-left" href="#" onClick={(e) => this.handleClick(e, "cart")}>
                        افزایش اعتبار
                    </a>
                </div>
            )
        }
        else {
            return(
                <div className="selectBar">
                    <a className="orderButtonOrder rounded-right" href="#" onClick={(e) => this.handleClick(e, "order")}>
                        سفارش&zwnj;ها
                    </a>
                    <a className="increaseButtonOrder rounded-left" href="#" onClick={(e) => this.handleClick(e, "cart")}>
                        افزایش اعتبار
                    </a>
                </div>
            )
        }
    }
}

class InfoBox extends React.Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            newCredit : 0,
            orders : [],
        };
    }

    handleChange(event){
        event.persist();
        this.setState(prevState => ({newCredit : parseInt(event.target.value)}));
    }

    handleSubmit(event){
        event.preventDefault();
        axios.post(`http://localhost:8080/Loghme/users/0?credit=`+ this.state.newCredit)
            .then(res => {
                this.setState(prevState => ({newCredit : 0}))
                ReactDOM.render(<Profile />, document.getElementById("root"));
                document.getElementById("creditForm").reset()
        })
        .catch(function (error) {
            console.log(error);
        })
    }
    

    render(){
        if(this.props.type === "cart"){
            return(
                <form id="creditForm" onSubmit={this.handleSubmit}>
                    <div id = "infoBox" className="infoBox">
                        <SelectBar value = {this.props.type}/>
                        <div className="dataContainer row">
                            <div className="col-md-3 offset-md-1 increaseButtonLink">
                                <button className="increaseButton btn rounded" type="submit">
                                    افزایش
                                </button>
                            </div>
                            <div className="col-md-7">
                                <div className="increaseField">
                                    <input type="text" className="formCtrl" placeholder="میزان افزایش اعتبار" name="credit" 
                                    onChange={this.handleChange}
                                    />
                                </div>
                            </div>  
                        </div>
                    </div>
                </form>
            )
        }
        else{
            const items=this.state.orders.map((item,key)=>
                <li key={item.id}>
                    <div className="row">
                        <div className="col-md-4 offset-md-1 ordersCell rounded-left">
                            <div className="row-no-padding">
                                <div className="col-md-8 offset-md-2 deliveringState rounded">
                                    {item.state}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5 ordersCell">{item.restaurantName}</div>
                        <div className="col-md-1 ordersCell rounded-right">{item.id}</div>
                    </div>
                </li>
            )
            console.log(this.state.orders)
            return(
                <div id = "infoBox" className="infoBox">
                    <SelectBar value = {this.props.type}/>
                    <div className="row dataContainer">
                        <div className="col-md-12 mt-3">
                            {items}
                        </div>
                    </div>
                </div>
            )
        }
    }
}


class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            user : "",
        };
    }

    fetchUser(){
        axios.get(`http://localhost:8080/Loghme/users/0`)
        .then(res => {
            var updatedUser = JSON.parse(JSON.stringify(res.data));
            this.setState({
                user : updatedUser,
            });
        })
    }

    componentDidMount(){
        this.fetchUser()
        this.timerId = setInterval(
    		() => {this.fetchUser()}
    		, 500
    	);
    }

    render(){      
        return(
            <div className="container-fluid loghmeContainer bg">
                <Header value = {"profile"}/>
                <InfoBar type = {"profile"} value = {this.state.user}/>
                <InfoBox type = {"cart"} value = {this.state.user.orders}/>
                <Footer />
            </div>
        )
    }
    
    componentWillUnmount(){
        clearInterval(this.timerId);
    }
}


Profile.propTypes = {
    user: PropTypes.object,
}

class Authentication extends React.Component {

    signupInput(){
        return(
            <div className="topBox">
                <input className ="inputBox" type="text" name="firstName" placeholder="نام" required/>
                <input className ="inputBox" type="text" name="lastName" placeholder="نام خانوادگی" required/>
                <input className ="inputBox" type="text" name="phoneNumber" placeholder="شماره تلفن" required/>
                <input className ="inputBox" type="text" name="email" placeholder="ایمیل" required/>
                <input className ="inputBox" type="password" name="password" placeholder="رمز عبور" required/>
                <input className ="inputBox" type="password" name="passwordConf" placeholder="تکرار رمز عبور" required/>
            <input className ="inputBox" type="submit" name="accountBtn" value="ثبت نام"/>
        </div>
        )
    }

    loginInput(){
        return(
            <div className="topBox">
                <input className ="inputBox" type="text" name="email" placeholder="ایمیل" required/>
                <input className ="inputBox" type="password" name="password" placeholder="رمز عبور" required/>
                <input className ="inputBox" type="submit" name="accountBtn" value="ورود"/>
            </div>
        )
    }
    render(){
        document.body.classList.add('authenticationBody');
        return(
            <div className="loghmeContainer">
                {this.props.type === 'signup' &&
                    <div className="accountHeader">
                        <h1>ثبت نام</h1>
                    </div>
                }
                {this.props.type === 'login' &&
                    <div className="accountHeader">
                        <h1>ورود به سامانه </h1>
                    </div>
                }
            <div className="accountBox">
                {this.props.type === 'signup' &&
                    this.signupInput()
                }
                {this.props.type === 'login' &&
                    this.loginInput()
                }
                <div className="bottomBox">
                    <div className="or">یا</div>
                    <span> از طریق حساب‌های اجتماعی </span>
                    <div className="logoBox">
                        <a   href="#">
                            <i className="flaticon-facebook-drawn-logo"></i>
                        </a>
                        <a href="#">
                            <i className="flaticon-twitter-draw-logo"></i>
                        </a>
                        <a href="#">
                            <i className="flaticon-google-plus-draw-logo"></i>
                        </a>
                    </div>
                    <a href="./Login.html" className="alreadyDone">
                    قبلا ثبت نام کرده‌اید؟ وارد سامانه شوید.
                    </a>
                </div>
                <Footer/>
            </div>
        </div>
        )
    }
}

class Home extends React.Component {
    render(){
        return(
            <div className="container-fluid loghmeContainer bg">
                <Header value = {"home"}/>
                <Footer />
            </div>
        )
    }
}

// ========================================

ReactDOM.render(<Authentication type = "login" />, document.getElementById("root"));
