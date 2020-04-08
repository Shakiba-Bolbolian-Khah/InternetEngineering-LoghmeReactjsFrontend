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
import './CSS/accountStyle.css';
import './media/FlatIcon/font/flaticon.css';
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
            orders : this.props.value,
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

    createOrderTable(){
        let table = []
        for (let i = 0; i < this.orders.length; i++) {
            console.log(this.orders[0].restaurantName)
            table.push(
                <div className="row">
                    <div className="col-md-4 offset-md-1 ordersCell rounded-left">
                        <div className="row-no-padding">
                            <div className="col-md-8 offset-md-2 deliveringState rounded">
                                {this.orders[0].state}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5 ordersCell">{this.orders[0].restaurantName}</div>
                    <div className="col-md-1 ordersCell rounded-right">{i+1}</div>
                </div>
            )
        }
        return table
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
            console.log(this.state.orders)
            return(
                <div id = "infoBox" className="infoBox">
                    <SelectBar value = {this.props.type}/>
                    <div className="row dataContainer">
                        <div className="col-md-12 mt-3">
                            {/* {this.createOrderTable()} */}
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

ReactDOM.render(<Profile />, document.getElementById("root"));
