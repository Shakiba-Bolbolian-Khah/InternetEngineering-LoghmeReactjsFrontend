import React from 'react';
import ReactDOM from 'react-dom';
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Authentication from "./Authentication"

class Profile extends React.Component {
    constructor(props){
        super(props);
        this.fetchUser = this.fetchUser.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.showSelectBar = this.showSelectBar.bind(this)
        this.showInfoBox = this.showInfoBox.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmitCredit = this.handleSubmitCredit.bind(this)
        this.createTable = this.createTable.bind(this)
        this.handleFactor = this.handleFactor.bind(this)
        this.renderFactor = this.renderFactor.bind(this)
        this.showFactor = this.showFactor.bind(this)
        this.createFactorTable = this.createFactorTable.bind(this)
        this.showFactorElements = this.showFactorElements.bind(this)
        this.showFactorElement = this.showFactorElement.bind(this)
        this.hideFactor = this.hideFactor.bind(this)
        this.showState = this.showState.bind(this)
        this.showOrder = this.showOrder.bind(this)
        this.showOrders = this.showOrders.bind(this)
        this.state = {
            user : "",
            ready: false,
            type: this.props.type,
            newCredit:0,
            readyBox : true,
        };
    }
    componentDidMount(){
        var now = new Date();
        var expDate = new Date(localStorage.getItem("expDate"));
        if(now.getTime() >= expDate.getTime()) {
            localStorage.removeItem("JWT")
            localStorage.removeItem("expDate")
            ReactDOM.render(<Authentication type = {"signup"} />, document.getElementById("root"));
        }
        this.fetchUser()
        this.timerId = setInterval(
    		() => {this.fetchUser()}
    		, 10000
        );
        window.addEventListener("click", this.hideFactor);
    }
    fetchUser(){
        var jwtStr = localStorage.getItem("JWT") || ''
        const requestOptions = {
            method: 'GET',
            headers: new Headers({
                'Authorization': jwtStr
            })
        }
        fetch('http://localhost:8080/Loghme/users', requestOptions)
        .then(response => {
            const statusCode = response.status;
            const data = response.json();
            return Promise.all([statusCode, data]);
        })
        .then(([stat, data]) => {
            if(stat===403){
                localStorage.removeItem("JWT")
                localStorage.removeItem("expDate")
                ReactDOM.render(<Authentication type={"signup"}/>, document.getElementById("root"));
            }
            if(stat===200){
                var updatedUser = data;
                this.setState({
                    user : updatedUser,
                    ready : true,
                })
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
    handleClick(event, page){
        event.preventDefault();
        ReactDOM.render(<this.showInfoBox type = {page}/>, document.getElementById("infoBox"));
    }
    showSelectBar(){
        if(this.state.type === "cart"){
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
    handleChange(event){
        event.persist();
        this.setState(prevState => ({newCredit : parseInt(event.target.value)}));
    }
    handleFactor(event,props){
        event.preventDefault();
        this.renderFactor(props)
    }
    renderFactor(props) {
        const modalWindow = this.showFactor(props);
        var modal = document.getElementById("factorModal");
        var content = document.getElementById("factorModal-content");
        content.classList.remove("zoomOut");
        content.classList.add("zoomIn");
        modal.style.display = "block";
        ReactDOM.render(modalWindow, content);
    }
    showFactorElement(props){
        return (
            <tr>
                <td>{String(props.number).toPersianDigits()}</td>
                <td>{props.element.foodName}</td>
                <td>{String(props.element.number).toPersianDigits()}</td>
                <td>{String(props.element.price).toPersianDigits()}</td>
            </tr>
        )
    }
    createFactorTable = (props) => {
        let factorTable = [];
        var items = props.items;
        for (let i = 0; i < items.length; i++) {
            factorTable.push(<this.showFactorElement key={i} element={items[i]} number={i+1}/>)
        }
        return factorTable
    }
    showFactorElements(props){
        return(
            <table>
                <tr>
                    <th className="orderFood-number">ردیف</th>
                    <th className="orderFood-name">نام غذا</th>
                    <th className="orderFood-count">تعداد</th>
                    <th className="orderFood-price">قیمت</th>
                </tr>
                {this.createFactorTable(props)}
            </table>
        )
    }
    showFactor(props) {
        var factor = this.state.user.orders[props];
        var totalPayment = String(factor.totalPayment).toPersianDigits()
        return (
            <div className="orderMoreInfoContainer orderDetails-modal-content modal-content">
                <div className="row col-12 mr-0 justify-content-center">
                    <div className="col-8 restaurantNameOfOrder">
                        {factor.restaurantName}
                    </div>
                </div>
                <this.showFactorElements items={factor.items} />            
                <div className="row col-12 mr-0 mb-3 justify-content-end text-left">
                    <div className="col-5 pl-4 pr-0 orderFood-totalPrice">
                        جمع کل : {totalPayment} تومان
                    </div>
                </div>
            </div>
        )
    }
    hideFactor(event) {
        var modal = document.getElementById("factorModal");
        var content = document.getElementById("factorModal-content");
        if (event.target == modal || event.target == content) {
            content.classList.remove("zoomIn");
            content.classList.add("zoomOut");
            setTimeout(() =>{
                modal.style.display = "none";
            },200);
        }
    }
    handleSubmitCredit(event){
        event.preventDefault();
        this.setState(prevState => ({readyBox: false}))
        if(isNaN(this.state.newCredit) || this.state.newCredit <= 0){
            toast.error("Bad input format")
            document.getElementById("creditForm").reset()
            this.setState(prevState => ({readyBox: true}))
            return
        }
        var params = {
		    "credit": this.state.newCredit,
        };
		var queryString = Object.keys(params).map(function(key) {
    		return key + '=' + params[key]
        }).join('&');
        var jwtStr = localStorage.getItem("JWT") || ''
		const requestOptions = {
	        method: 'POST',
	        headers: new Headers({ 
	        	'content-length' : queryString.length,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': jwtStr
	        }),
	        body: queryString
	    };
        fetch(`http://localhost:8080/Loghme/users`, requestOptions)
        .then((response) => {
            if(response.status === 403) {
                localStorage.removeItem("JWT")
                localStorage.removeItem("expDate")
                ReactDOM.render(<Authentication type={"signup"}/>, document.getElementById("root"));
            }
            else {
                this.setState(prevState => ({
                    newCredit : 0,
                    readyBox: true,    
                }))
                ReactDOM.render(<Profile type={"cart"}/>, document.getElementById("root"));
                document.getElementById("creditForm").reset()
                toast.success("Credit increamented successfully")
            }
        })
        .catch(function (error) {
            toast.error("Credit increament failed")
        })
    }
    showState(props){
        if(props.state === "Searching"){
            return(
                <div className="col-md-8 offset-md-2 searchingState rounded">
                    در جست&zwnj;جوی پیک
                </div>
            )
        }
        else if(props.state === "Delivering"){
            return(
                <div className="col-md-8 offset-md-2 deliveringState rounded">
                    پیک در مسیر
                </div>
            )
        }
        else{
            return(
                <button id={props.orderId} className="deliveredState col-md-8 offset-md-2 btn btn-block rounded"  type="submit" onClick={(e) => this.handleFactor(e,props.orderId)}>مشاهده فاکتور</button>
            )
        }
    }
    showOrder(props){
        var restaurantName = (props.order.restaurantName.length > 25) ? "..."+props.order.restaurantName.substring(0,25) : props.order.restaurantName;
        return (
            <div className="row">
                <div className="col-md-4 offset-md-1 ordersCell rounded-left">
                    <div className="row-no-padding">
                        <this.showState state={props.order.state} orderId={props.number-1}/>
                    </div>
                </div>
                <div className="col-md-5 ordersCell">{restaurantName}</div>
                <div className="col-md-1 ordersCell rounded-right">{String(props.number).toPersianDigits()}</div>
            </div>
        )
    }
    createTable = () => {
        let orderTable = [];
        var orders = this.state.user.orders;
        for (let i = 0; i < orders.length; i++) {
            orderTable.push(<this.showOrder key={orders[i].id} order={orders[i]} number={i+1}/>)
        }
        return orderTable
    }
    showOrders(){
        return( 
            <div className="col-md-12 mt-3">
                {this.createTable()}
            </div>             
        )
    }
    showInfoBox(props){
        if(props.type !== this.state.type){
            this.setState({
                type:props.type
            })
        }
        if(props.type === "cart"){
            return(
                <form id="creditForm" onSubmit={this.handleSubmitCredit}>
                    <div id = "infoBox" className="infoBox">
                        <ToastContainer/>
                        <this.showSelectBar/>
                        <div className="dataContainer row">
                            <div className="col-md-3 offset-md-1 increaseButtonLink">
                                {!this.state.readyBox ? ( 
                                    <button className="increaseButton btn rounded" type="submit">
                                        <span className="spinner-grow spinner-grow-sm"></span>
                                    </button>
                                ):(
                                    <button className="increaseButton btn rounded" type="submit"> افزایش</button>
                                )}
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
            return(
                <div id = "infoBox" className="infoBox">
                    <this.showSelectBar/>
                    <div className="row dataContainer">
                        <this.showOrders/>
                    </div>
                </div>
            )
        }
    }

    render(){
        if(this.state.ready){     
            return(
                <div className="container-fluid loghmeContainer bg">
                    <Header value = {this.state.type}/>
                    <ToastContainer/>
                    <InfoBar type = {"profile"} value = {this.state.user}/>
                    <this.showInfoBox id="infoBox" type ={this.state.type}/>
                    <div id="factorModal" className="orderDetails-modal modal">
                        <div id="factorModal-content" className="row animated faster zoomIn text-center">
                        </div>
                    </div>
                    <Footer />
                </div>
            )
        }
        else{
            return(
                <div className="container-fluid loghmeContainer bg">
                    <Header value = {"profile"}/>
                    <ToastContainer/>
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
    type: PropTypes.string,
}

Profile.defaultProps = {
    type : "cart"
}

export default Profile;