import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import './CSS/Normalize.css';
import './CSS/headerStyles.css';
import './CSS/basicStyles.css';
import './CSS/footerStyles.css';
import './CSS/infoBarStyles.css';
import './CSS/profileStyles.css';
import './CSS/homePageStyles.css';
import './CSS/homeSearchBar.css';
import './CSS/restaurantStyles.css';
import './CSS/authenticationStyles.css';
import './CSS/ModalsStyles.css'
import './media/FlatIcon/font/flaticon.css';
import './media/FlatIcon/font-signup/flaticon.css';

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
                            <img className="LoghmeLogo" src={require('./media/Pics/LOGO.png')} alt="logo"></img>
                        </a>
                    </div>
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
                            <i className="flaticon-loghme-phone"></i>
                            <div>{this.props.value.phoneNumber}</div>
                        </div>
                        <div className ="infoBarDetailData">
                            <i className="flaticon-loghme-mail"></i>
                            <div>{this.props.value.email}</div>
                        </div>
                        <div className="infoBarDetailData">
                            <i className="flaticon-loghme-card"></i>
                            <div>{String(this.props.value.credit).toPersianDigits()} تومان</div>
                        </div>
                    </div>
                    <div className="infoBarUsername">
                        <i className="flaticon-loghme-account"></i>
                        <div>{this.props.value.firstName} {this.props.value.lastName}</div>
                    </div>
                </div>
            )
        }
        else if(this.props.type === "restaurant"){
            return(
                <div className="row infoBar"></div>
            )
        }
        else if(this.props.type === "home") {
            return(
                <div className="row searchBarBg">
                    <div className="searchBarEffect">
                    </div>
                </div>
            )
        }
    }
}

class SelectBar extends React.Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(event, page){
        event.preventDefault();
        ReactDOM.render(<InfoBox type = {page} />, document.getElementById("creditForm"));
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
                            items
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
        this.state = {
            firstName : "",
            lastName : "",
            phone : "",
            email : "",
            pass : "",
            rePass : ""
        }
    }
    componentWillUnmount(){
        document.body.classList.remove('authenticationBody');
    }
    handleFirstName(event) {
        event.persist();
        this.setState(prevState => ({firstName: event.target.value}));
        console.log(this.state.firstName);
    }
    handleLastName(event, type){
        event.persist();
        this.setState(prevState => ({lastName: event.target.value}));
        console.log(this.state.lastName);
    }
    handleEmail(event) {
        event.persist();
        this.setState(prevState => ({email: event.target.value}));
        console.log(this.state.email);
    }
    handlePhone(event) {
        event.persist();
        this.setState(prevState => ({phone: event.target.value}));
        console.log(this.state.phone);
    }
    handlePassword(event) {
        event.persist();
        this.setState(prevState => ({pass: event.target.value}));
        console.log(this.state.pass);
    }
    handleRePass(event) {
        event.persist();
        this.setState(prevState => ({rePass: event.target.value}));
        console.log(this.state.rePass);
    }
    handleAnother(event) {
        event.preventDefault();
        var anotherPage = this.props.type === 'signup' ? 'login' : 'signup';
        ReactDOM.render(<Authentication type = {anotherPage}/>, document.getElementById("root"));
    }
    handleSubmit(event) {
        event.preventDefault();
        let emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        console.log(this.state.email)
        if(!emailRe.test(this.state.email)) {
            console.log("Invalid email");
            //Error: Invalid email format
            // reset form
        }
        if(this.props.type === 'signup'){
            let phoneRe = /09[0-9]{9}/;
            if(!phoneRe.test(this.state.phone)){
                console.log("Phone number is not valid in iran");
                //Error: Phone number is not valid
            }
            let passRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
            if(this.state.pass !== this.state.rePass){
                console.log("Passwords are not same")
                //Error msg: Invalid password validation
            }
            else if(!passRe.test(this.state.pass)){
                console.log("Weak password")
                //Error: Weak password
            }
            if(this.state.firstName.length < 3 || this.state.lastName.length < 3){
                console.log("Name is not valid")
            }
        }
        
    }

    signupInput(){
        return(
            <form onSubmit={this.handleSubmit}>
                <div className="topBox">
                    <input className ="inputBox" type="text" name="firstName" placeholder="نام" onChange={this.handleFirstName} required/>
                    <input className ="inputBox" type="text" name="lastName" placeholder="نام خانوادگی" onChange={this.handleLastName} required/>
                    <input className ="inputBox" type="text" name="phoneNumber" placeholder="شماره تلفن" onChange={this.handlePhone} required/>
                    <input className ="inputBox" type="text" name="email" placeholder="ایمیل" onChange={this.handleEmail} required/>
                    <input className ="inputBox" type="password" name="password" placeholder="رمز عبور" onChange={this.handlePassword} required/>
                    <input className ="inputBox" type="password" name="passwordConf" placeholder="تکرار رمز عبور" onChange={this.handleRePass} required/>
                    <button className ="inputBox" type="submit" >ثبت نام</button>
                </div>
            </form>
        )
    }

    loginInput(){
        return(
            <form onSubmit={this.handleSubmit}>
                <div className="topBox">
                    <input className ="inputBox" type="text" name="email" placeholder="ایمیل" onChange={this.handleEmail} required/>
                    <input className ="inputBox" type="password" name="password" placeholder="رمز عبور" onChange={this.handlePassword} required/>
                    <button className ="inputBox" type="submit">ورود</button>
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
                    <span> از طریق حساب‌های اجتماعی </span>
                    <div className="logoBox">
                        <a   href="#">
                            <i className="flaticon-Auth-facebook-drawn-logo"></i>
                        </a>
                        <a href="#">
                            <i className="flaticon-Auth-twitter-draw-logo"></i>
                        </a>
                        <a href="#">
                            <i className="flaticon-Auth-google-plus-draw-logo"></i>
                        </a>
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

class FoodParty extends React.Component {
    constructor(props){
        super(props);
        this.fetchParty = this.fetchParty.bind(this);
        this.remainingTime = this.remainingTime.bind(this);
        this.showPartyFoods = this.showPartyFoods.bind(this);
        this.showPartyFood = this.showPartyFood.bind(this);
        this.handleModal = this.handleModal.bind(this);
        this.showPartyFoodBuyModal = this.showPartyFoodBuyModal.bind(this);
        this.hidePartyFoodBuyModal = this.hidePartyFoodBuyModal.bind(this);
        this.increaseOrderCount = this.increaseOrderCount.bind(this);
        this.decreaseOrderCount = this.decreaseOrderCount.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.state = {
            partyFoods : [],
            date : "",
            orderCount : 0,
        };
    }

    fetchParty(){
        axios.get(`http://localhost:8080/Loghme/foodparty`)
        .then(res => {
            if(res !== undefined){
                var updatedParty = JSON.parse(JSON.stringify(res.data));
                var date = JSON.parse(JSON.stringify(updatedParty.enteredDate));
                const enteredDate = (date!== null) ? new Date(date.year,date.monthValue-1, date.dayOfMonth, date.hour, date.minute, date.second, 0)
                : "";
                var foods = JSON.parse(JSON.stringify(updatedParty.partyFoods));
                this.setState({
                    partyFoods : foods,
                    date : enteredDate,
                });
            }
        })
    }
    
    componentDidMount(){
        this.fetchParty()
        this.timerId = setInterval(
    		() => {this.fetchParty()}
    		, 1000
        );
        window.addEventListener("click", this.hidePartyFoodBuyModal);
    }

    handleModal(event,props) {
        event.preventDefault()
        this.renderModal(props)
    }

    renderModal(props) {
        const modalWindow = this.showPartyFoodBuyModal(props);
        var modal = document.getElementById("partyFoodsModal");
        var content = document.getElementById("partyFoodsModal-content");
        content.classList.remove("zoomOut");
        content.classList.add("zoomIn");
        modal.style.display = "block";
        ReactDOM.render(modalWindow, content);
    }

    increaseOrderCount(props) {
        var newCount = this.state.orderCount + 1;
        if (this.state.orderCount < props.count) {
            this.setState({
                orderCount : newCount
            }, () => this.renderModal(props));
        } else {
            // notif error
        }
    }

    decreaseOrderCount(props) {
        var newCount = this.state.orderCount - 1;
        if (this.state.orderCount > 0) {
            this.setState({
                orderCount : newCount
            }, () => this.renderModal(props));
        } else {
            // notif error
        }
    }

    showPartyFoodBuyModal(props) {
        var count = (props.count == 0) ? "ناموجود" : "موجودی: "+String(props.count).toPersianDigits();
        return (
            <div className="partyFoodMoreInfoContainer food-modal-content modal-content">
                <div className="col-12 partyFoodMoreInfo">
                    {props.restaurantName}
                </div>        
                <div className="row ml-0 mr-0 bottomDashedBorder">
                    <div className="col-4 pl-0 pr-1 mr-2">
                        <img className="partyFoodBigLogo borderShadow" src={props.imageUrl}/>
                    </div>
                    <div>
                        <div className="row no-gutters">
                            <div className="col-auto partyFoodBigName">{props.name}</div>
                            <div className="row ml-0 mr-0 justify-content-start">
                            <div className="starBigIcon text-right">&#9733;</div>
                            <div className="partyFoodBigRate">{String(5 * props.popularity).toPersianDigits()}</div>
                            </div>
                        </div>
                        
                        <div className="row no-gutters">
                            <div className="partyFoodDescription">{props.description}</div>
                        </div>
            
                        <div className="row no-gutters pt-3">
                            <div className="partyFoodOldBigPrice pl-0"><s className="partyFoodOldBigPrice">{String(props.oldPrice).toPersianDigits()}</s></div>
                            <div className="partyFoodNewBigPrice pl-0">{String(props.price).toPersianDigits()} تومان</div>
                        </div>
                    </div>
                </div>
                <div className="row stockContainer-big ml-0 mr-0 text-center justify-content-around">
                    <div className="col-2 partyStockBigInfo align-self-center">{count}</div>
                    <div className="row col-2 pl-0 pr-0 foodCount-big justify-content-center align-self-center">
                        <a href="#" onClick={() => this.increaseOrderCount(props)}>
                            <i className="flaticon-loghme-big-plus"></i>
                        </a>
                        <div className="mr-2 ml-2">{String(this.state.orderCount).toPersianDigits()}</div>
                        <a href="#" onClick={() => this.decreaseOrderCount(props)}>
                            <i className="flaticon-loghme-big-minus"></i>
                        </a>
                    </div>
                    <button className="col-4 partyBigBuyButton payBlueBG btn align-self-center" type="submit">افزودن به سبد خرید</button>
                </div>
            </div>
        )
    }

    hidePartyFoodBuyModal(event) {
        var modal = document.getElementById("partyFoodsModal");
        var content = document.getElementById("partyFoodsModal-content");
        if (event.target == modal || event.target == content) {
            content.classList.remove("zoomIn");
            content.classList.add("zoomOut");
            setTimeout(() =>{
                modal.style.display = "none";
                this.setState({
                    orderCount : 0
                });
            },200);
        }
    }

    showPartyFood(props){
        var name = (props.partyFood.name.length > 4) ? props.partyFood.name.substring(0,4)+"..." : props.partyFood.name;
        var restaurantName = (props.partyFood.restaurantName.length > 20) ? props.partyFood.restaurantName.substring(0,20)+"..." : props.partyFood.restaurantName;
        var count = (props.partyFood.count == 0) ? "ناموجود" : "موجودی: "+String(props.partyFood.count).toPersianDigits();
        return (
            <div className="partyFoodInfo borderShadow">
                <div className="row no-gutters text-center mr-1 ml-1 justify-content-center">
                    <img className="partyFoodLogo" src={props.partyFood.imageUrl}/>
                    <div className="col-auto">
                        <div className="col-auto partyFoodName">{name}</div>
                        <div className="row ml-0 mr-0 pr-2 justify-content-start">
                        <div className="partyFoodRate">{String(5 * props.partyFood.popularity).toPersianDigits()}</div>
                            <div className="starIcon text-right">&#9733;</div>
                        </div>
                    </div>
                </div>
                <div className="row text-center mr-1 ml-1 mt-2 pb-1 justify-content-around">
                    <div className="partyFoodOldPrice pl-0"><s className="partyFoodOldPrice">{String(props.partyFood.oldPrice).toPersianDigits()}</s></div>
                    <div className="partyFoodNewPrice pl-0">{String(props.partyFood.price).toPersianDigits()}</div>
                </div>
                <div className="row text-center mt-2 mr-0 ml-0 justify-content-around">
                <div className="col-5 partyStockInfo align-self-center">{count}</div>
                { props.partyFood.count === 0
                    ? <div className="col-5 partyBuyButton payGrayBG btn">خرید</div>
                    : <button id={props.partyFood.restaurantId+"-"+props.partyFood.restaurantName} className="col-5 partyBuyButton payBlueBG btn" type="submit" onClick={(e) => this.handleModal(e,props.partyFood)}>خرید</button>
                }
                </div>
                <div className="bottomDashedBorder mt-1"></div>
                <div className="row partyRestaurantName pt-1 justify-content-center">{restaurantName}</div>
            </div>
        )
    }

    showPartyFoods(){
        const items = this.state.partyFoods.map((item, index)=>
            <this.showPartyFood key={index} partyFood={item} />
        )
        return(  
            items
        )
    }

    remainingTime(){
        if(this.state.date !== "" ){
            var now = new Date()
            var remainedTime = 1800000-(now.getTime() - this.state.date.getTime())
            var min = Math.floor(remainedTime / 60000)
            var sec = Math.floor((remainedTime - min*60000) / 1000)
        }
        else{
            var min = "00"
            var sec = "00"
        }
        return(
            <div className="row col-12 justify-content-center">
                <div className="row remainingTimeBox rounded justify-content-between">
                    <div className="col-9 pl-0 pr-0 align-self-center text-right">زمان باقی&zwnj;مانده:</div>
                    <div className="col-3 pl-0 pr-0 align-self-center text-left">{String(min).toPersianDigits()}:{String(sec).toPersianDigits()}</div>
                </div>
            </div>
        )
    }

    render(){
        return(
            <div className="row mt-3 justify-content-center">
                <div className="row col-12 justify-content-center">
                    <div className="col-2 titles titlesUnderline pr-0 pl-0 text-center">جشن غذا!</div>
                </div>
                <this.remainingTime />
                <div className="col-12 foodPartyMenu borderShadow text-center">
                    <this.showPartyFoods />
                    <div id="partyFoodsModal" className="food-modal modal">
                        <div id="partyFoodsModal-content" className="row animated faster zoomIn text-center">
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentWillUnmount(){
        clearInterval(this.timerId)
    }
}

class HomeRestaurants extends React.Component {
    constructor(props){
        super(props);
        this.fetchRestaurants = this.fetchRestaurants.bind(this);
        this.showRestaurants = this.showRestaurants.bind(this);
        this.showRestaurant = this.showRestaurant.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            restaurants : []
        };
    }

    fetchRestaurants(){
        axios.get(`http://localhost:8080/Loghme/restaurants`)
        .then(res => {
            var updatedRestaurants = JSON.parse(JSON.stringify(res.data));
            this.setState({
                restaurants : updatedRestaurants
            });
        })
    }

    componentDidMount(){
        this.fetchRestaurants()
    }


    handleSubmit(event,id){
        event.preventDefault()
        ReactDOM.render(<Restaurant id = {id}/>, document.getElementById("root"));
    }

    showRestaurant(props){
        var restaurantName = (props.restaurant.name.length > 20) ? props.restaurant.name.substring(0,20)+"..." : props.restaurant.name;
        return (
            <div className="col-2 restaurantInfo pl-0 pr-0 text-center borderShadow">
                <img className="restaurantSmallLogo" src={props.restaurant.logoUrl}/>
                <div className="row no-gutters justify-content-center">
                    <div className="col-auto restaurantSmallName pt-2 text-center">{restaurantName}</div>
                </div>
                <form id={props.restaurant.id} onSubmit={(e) => this.handleSubmit(e,props.restaurant.id)}>
                    <button className="showMenuButton btn rounded" type="submit" >نمایش منو</button>
                </form>
            </div>
        )
    }

    createRestaurantsMenu = () => {
        const rowsNum = Math.floor(this.state.restaurants.length / 4);
        let restaurantsTable = [];
    
        for (let i = 0; i < rowsNum; i++) {
            let children = []

            for (let j = 0; j < 4; j++) {
                children.push(<this.showRestaurant key={this.state.restaurants[i*4+j].id} restaurant={this.state.restaurants[i*4+j]} />)
            }
            
            restaurantsTable.push(
                <div className="row mb-3 justify-content-center">
                    {children}
                </div>
            )
        }
        
        let children = []
        for (let i = rowsNum*4; i < this.state.restaurants.length; i++) {
            children.push(<this.showRestaurant key={this.state.restaurants[i].id} restaurant={this.state.restaurants[i]} />)
        }
        restaurantsTable.push(
            <div className="row mb-3 justify-content-center">
                {children}
            </div>
        )

        return restaurantsTable
    }

    showRestaurants(){
        return(  
            <div className="row marginFromFooter">
                <div className="col-12 restaurants justify-content-center">
                    {this.createRestaurantsMenu()}
                </div>
            </div>
        )
    }

    render(){
        return(
            <div>
                <div className="row mt-4 justify-content-center">
                    <div className="row col-12 justify-content-center">
                        <div className="col-2 titles titlesUnderline pr-0 pl-0 text-center">رستوران&zwnj;ها</div>
                    </div>
                </div>
                <this.showRestaurants />
            </div>
        )
    }
}

class Restaurant extends React.Component {
    constructor(props){
        super(props);
        this.fetchRestaurant = this.fetchRestaurant.bind(this)
        this.showFoods = this.showFoods.bind(this)
        this.createRestaurantMenu = this.createRestaurantMenu.bind(this)
        this.showFood = this.showFood.bind(this)
        this.showCart = this.showCart.bind(this)
        this.state = {
            restaurant : "",
            foods :[],
            cart : "",
        };
    }

    fetchRestaurant(){
        axios.get(`http://localhost:8080/Loghme/restaurants/`+ this.props.id)
        .then(res => {
            var newRestaurant = JSON.parse(JSON.stringify(res.data));
            var newFoods = JSON.parse(JSON.stringify(newRestaurant.menu));
            this.setState({
                restaurant: newRestaurant,
                foods: newFoods,
            });
        })
        .catch(error => {
            console.log(error.response.status)
            console.log(error.response.data)
        })

        axios.get(`http://localhost:8080/Loghme/users/cart?userId=0`)
        .then(res => {
            var newCart = JSON.parse(JSON.stringify(res.data));
            this.setState({
                cart: newCart,
            });
        })
        .catch(error => {
            console.log(error.response.status)
            console.log(error.response.data)
        })
    }
    
    componentDidMount() {
        this.fetchRestaurant()
        this.timerId = setInterval(
    		() => {this.fetchRestaurant()}
    		, 1000000
        );
    }

    showCart() {
        if(this.state.cart == ""){
            return(
                <div className="col-3 align-self-start justify-content-center shoppingCart borderShadow">
            <div className="shoppingCartText text-center">سبد خرید</div>
                <div className="shoppingCartContents">
                    <div className="col-12 text-center">غذایی انتخاب نشده است.</div>
                </div>
                </div>
            )
        }
        else{
            return(
            <div className="col-3 align-self-start justify-content-center shoppingCart borderShadow">
            <div className="shoppingCartText text-center">سبد خرید</div>
            <div className="shoppingCartContents">
                <div>
                    <div className="firstItem shoppingCartItem justify-content-around">
                        <div className="col-7 text-right">پیتزا اعلا</div>
                        <div className="col-5">
                            <i className="flaticon-minus"></i>
                            ۲
                            <i className="flaticon-plus"></i>
                        </div>
                    </div>
                    <div className="price priceUnderline">۷۸۰۰۰ تومان</div>
                </div>
                <div>
                    <div className="shoppingCartItem justify-content-around">
                        <div className="col-7 text-right">پیتزا نیمه&zwnj;اعلا</div>
                        <div className="col-5">
                            <i className="flaticon-minus"></i>
                            ۱
                            <i className="flaticon-plus"></i>
                        </div>
                    </div>
                    <div className="lastItem price priceUnderline">۲۹۰۰۰ تومان</div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="totalPriceText">جمع کل:</div>
                <div className="totalPriceValue">۱۰۷۰۰۰ تومان</div>
            </div>
            <div className="row justify-content-center">
                <button className="col-6 pl-1 pr-1 text-center btn submitButton" type="submit">
                    تایید نهایی
                </button>
            </div>
            </div>
            )
        }       
        
    }

    showFood(props){
        var foodName = (props.food.name.length > 12) ? props.food.name.substring(0,12)+"..." : props.food.name;
        return (
            <div className="col-3 menuItem pl-0 pr-0 text-center borderShadow">
                <img className="foodLogo" src={props.food.imageUrl}/>
                <div className="row no-gutters text-center foodInfo justify-content-center">
                    <div className="col-auto foodName">{foodName}</div>
                    <div className="col-auto foodRate">{String(5* props.food.popularity).toPersianDigits()}</div>
                    <div className="col-auto starIcon text-right">&#9733;</div>
                </div>
                <div className="price pl-0">{String(props.food.price).toPersianDigits()} تومان</div>
                <button className="addToCartButton btn rounded" type="submit">افزودن به سبد خرید</button>
                {/* We should handle add to cart */}
            </div>
        )
    }

    createRestaurantMenu = () => {
        const rowsNum = Math.floor(this.state.foods.length / 3);
        let menuTable = [];
    
        for (let i = 0; i < rowsNum; i++) {
            let children = []

            for (let j = 0; j < 3; j++) {
                children.push(<this.showFood key={this.state.foods[i*3+j].id} food={this.state.foods[i*3+j]} />)
            }
            
            menuTable.push(
                <div className="row menuContents justify-content-end">
                    {children}
                </div>
            )
        }
        let children = []
        for (let i = rowsNum*3; i < this.state.foods.length; i++) {
            children.push(<this.showFood key={this.state.foods[i].name} food={this.state.foods[i]} />)
        }
        menuTable.push(
            <div className="row menuContents justify-content-end">
                {children}
            </div>
        )

        return menuTable    
    }

    showFoods(){
        return(
            <div className="col-8 menu dashedDivider justify-content-end">
                {this.createRestaurantMenu()}
            </div>
        )
    }

    render() {
        return(
            <div className="container-fluid loghmeContainer bg">
            <Header value = {"restaurant"}/>
            <InfoBar type = {"restaurant"}/>
            <div className ="row justify-content-center">
                <img className ="restaurantBigLogo borderShadow" src={this.state.restaurant.logoUrl}/>
            </div>
            <div className="row justify-content-center">
                <div className="restaurantBigName">{this.state.restaurant.name}</div>
            </div>
            <div className="row">
                <div className="col-8 menuTextAlign justify-content-center">
                    <div className="row justify-content-center">
                        <div className="col-3 menuText menuUnderline pr-0 pl-0 text-center">منوی غذا</div>
                    </div>
                </div>
            </div>
            <div className="row marginFromFooter">
                <this.showFoods/>
                <this.showCart/>
            </div>
            <Footer/>
            </div>
        )
    }
}

class Home extends React.Component {
    searchBar(){
        return(
            <div className="row searchBarContents">
                <div className="col-12 justify-content-center">
                    <div className="row justify-content-center">
                        <img className="Loghme borderShadow" src={require("./media/Pics/LOGO.png")} alt="logo"/>
                    </div>
                    <div className="row LoghmeDescribe justify-content-center">
                        اولین و بزرگ&zwnj;ترین وب&zwnj;سایت سفارش آنلاین غذا در دانشگاه تهران
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-6 pl-0 pr-0 searchArea borderShadow rounded text-center">
                            <div className="row justify-content-center">
                                <div className="col-4 pl-0 pr-0">
                                    <input type="text" className="inputDesign text-center" placeholder="نــــام غـــذا" name="credit"/>
                                </div>
                                <div className="col-4 pl-0 pr-0 text-center">
                                    <input type="text" className="inputDesign text-center" placeholder="نــــام رســــتـــوران" name="credit"/>
                                </div>
                                <div className="col-3 pr-0 pl-3 text-center">
                                    <button className="serachButton btn btn-block" type="submit">جســت&zwnj;و&zwnj;جـو</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render(){
        return(
            <div className="container-fluid loghmeContainer bg">
                <Header value = {"home"}/>
                <InfoBar type = {"home"}/>
                <this.searchBar/>
                <FoodParty />
                <HomeRestaurants />
                <Footer />
            </div>
        )
    }
}

// ========================================

ReactDOM.render(<Home />, document.getElementById("root"));
