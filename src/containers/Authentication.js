import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import '../CSS/Normalize.css';
import '../CSS/basicStyles.css';
import '../CSS/authenticationStyles.css';
import '../media/FlatIcon/font-signup/flaticon.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "../components/Footer"

class Authentication extends React.Component {
    constructor(props){
        super(props);
        this.handleFirstName = this.handleFirstName.bind(this);
        this.handleLastName = this.handleLastName.bind(this);
        this.handlePhone = this.handlePhone.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleRePass = this.handleRePass.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAnother = this.handleAnother.bind(this);
        this.googleSDK = this.googleSDK.bind(this);
        this.prepareLoginButton = this.prepareLoginButton.bind(this);
        this.state = {
            firstName : "",
            lastName : "",
            phone : "",
            email : "",
            pass : "",
            rePass : "",
            clicked : false,
        }
    }
    componentDidMount(){
        this.googleSDK();
    }
    componentWillUnmount(){
        document.body.classList.remove('authenticationBody');
    }
    handleFirstName(event) {
        event.persist();
        this.setState(prevState => ({firstName: event.target.value}));
    }
    handleLastName(event, type){
        event.persist();
        this.setState(prevState => ({lastName: event.target.value}));
    }
    handleEmail(event) {
        event.persist();
        this.setState(prevState => ({email: event.target.value}));
    }
    handlePhone(event) {
        event.persist();
        this.setState(prevState => ({phone: event.target.value}));
    }
    handlePassword(event) {
        event.persist();
        this.setState(prevState => ({pass: event.target.value}));
    }
    handleRePass(event) {
        event.persist();
        this.setState(prevState => ({rePass: event.target.value}));
    }
    handleAnother(event) {
        event.preventDefault();
        var anotherPage = this.props.type === 'signup' ? 'login' : 'signup';
        ReactDOM.render(<Authentication type = {anotherPage}/>, document.getElementById("root"));
    }
    handleSubmit(event) {
        this.setState(prevState => ({clicked: true}));
        var hasError = false
        event.preventDefault();
        let emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!emailRe.test(this.state.email)) {
            setTimeout(() => { toast.error("Invalid email format")}, 3000);
            hasError = true
        }
        if(this.props.type === 'signup'){
            let phoneRe = /09[0-9]{9}/;
            if(!phoneRe.test(this.state.phone)){
                setTimeout(() => { toast.error("Invalid phone number");}, 3000);
                hasError = true
            }
            let passRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
            if(this.state.pass !== this.state.rePass){
                setTimeout(() => { toast.error("Passwords are not same")}, 3000);
                
                hasError = true
            }
            else if(!passRe.test(this.state.pass)){
                setTimeout(() => {toast.error("Weak password")}, 3000);
                hasError = true
            }
            if(this.state.firstName.length < 3 || this.state.lastName.length < 3){
                setTimeout(() => { toast.error("First name or last name is not valid")}, 3000);
                hasError = true
            }
        }
        if(!hasError){
            toast.success("Your "+this.props.type+" completed successfully!")
            document.getElementById("authForm").reset()
        }
        setTimeout(() => {  this.setState(prevState => ({clicked: false})) }, 3000); 
        // ToDo: Call sign up or login and render home if it is successful!  
    }
    prepareLoginButton = () => {
 
        console.log(this.refs.googleLoginBtn);
         
        this.auth2.attachClickHandler(this.refs.googleLoginBtn, {},
            (googleUser) => {
            let profile = googleUser.getBasicProfile();
            console.log('Token || ' + googleUser.getAuthResponse().id_token);
            console.log('ID: ' + profile.getId());
            console.log('Name: ' + profile.getName());
            console.log('Image URL: ' + profile.getImageUrl());
            console.log('Email: ' + profile.getEmail());
            // ToDo : Call sign in for google logging
            //YOUR CODE HERE
            }, (error) => {
            alert(JSON.stringify(error, undefined, 2));
        });
         
    }
    googleSDK() {
        window['googleSDKLoaded'] = () => {
          window['gapi'].load('auth2', () => {
            this.auth2 = window['gapi'].auth2.init({
              client_id: 'YOUR_CLIENT_ID', //ToDo: Change to our client ID
              cookiepolicy: 'single_host_origin',
              scope: 'profile email'
            });
            this.prepareLoginButton();
          });
        }
       
        (function(d, s, id){
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {return;}
          js = d.createElement(s); js.id = id;
          js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'google-jssdk'));
       
    }
    
    signupInput(){
        return(
            <form id="authForm" onSubmit={this.handleSubmit}>
                <div className="topBox">
                    <ToastContainer autoClose={6000}/>
                    <input className ="inputBox" type="text" name="firstName" placeholder="نام" onChange={this.handleFirstName} required/>
                    <input className ="inputBox" type="text" name="lastName" placeholder="نام خانوادگی" onChange={this.handleLastName} required/>
                    <input className ="inputBox" type="text" name="phoneNumber" placeholder="شماره تلفن" onChange={this.handlePhone} required/>
                    <input className ="inputBox" type="text" name="email" placeholder="ایمیل" onChange={this.handleEmail} required/>
                    <input className ="inputBox" type="password" name="password" placeholder="رمز عبور" onChange={this.handlePassword} required/>
                    <input className ="inputBox" type="password" name="passwordConf" placeholder="تکرار رمز عبور" onChange={this.handleRePass} required/>
                    {this.state.clicked ? ( 
                        <button className ="inputBox" type="submit" >
                            <span className="spinner-grow spinner-grow-sm"></span>
                            ...منتظر بمانید
                        </button>
                    ):(
                    <button className ="inputBox" type="submit" >ثبت نام</button>
                    )}
                </div>
            </form>
        )
    }
    loginInput(){
        return(
            <form id="authForm" onSubmit={this.handleSubmit}>
                <div className="topBox">
                    <ToastContainer autoClose={5000}/>
                    <input className ="inputBox" type="text" name="email" placeholder="ایمیل" onChange={this.handleEmail} required/>
                    <input className ="inputBox" type="password" name="password" placeholder="رمز عبور" onChange={this.handlePassword} required/>
                    {this.state.clicked ? ( 
                        <button className ="inputBox" type="submit" >
                            <span className="spinner-grow spinner-grow-sm"></span>
                            ...منتظر بمانید
                        </button>
                    ):(
                    <button className ="inputBox" type="submit" >ورود</button>
                    )}
                </div>
            </form>
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
                    <span>ورود از طریق حساب‌های اجتماعی </span>
                    <div className="logoBox">
                        <button className="loginBtn loginBtn--google" ref="googleLoginBtn">
                            <i className="flaticon-Auth-google-plus-draw-logo"></i>
                        </button>
                    </div>
                    {this.props.type === 'signup' &&
                        <a href="#" className="alreadyDone" onClick={this.handleAnother}>قبلا ثبت نام کرده‌اید؟ وارد سامانه شوید.</a>
                    }
                    {this.props.type === 'login' &&
                        <a href="#" className="alreadyDone" onClick={this.handleAnother}>هنوز ثبت نام نکرده‌اید؟ ثبت نام کنید.</a> 
                    }
                </div>
                <Footer/>
            </div>
        </div>
        )
    }
}

Authentication.propTypes = {
    type: PropTypes.string,
};

Authentication.defaultProps = {
    type: 'signup'
}

export default Authentication;