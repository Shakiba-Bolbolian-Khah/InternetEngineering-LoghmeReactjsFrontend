import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import '../CSS/Normalize.css';
import '../CSS/basicStyles.css';
import '../CSS/profileStyles.css';
import '../CSS/ModalsStyles.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SelectBar from "./SelectBar";
import Profile from "./Profile";

String.prototype.toPersianDigits= function(){
    var id = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return this.replace(/[0-9]/g, function(w){
        return id[+w]
    });
}

class InfoBox extends React.Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createTable = this.createTable.bind(this);
        this.handleFactor = this.handleFactor.bind(this)
        this.showOrder = this.showOrder.bind(this)
        this.showOrders = this.showOrders.bind(this)
        this.state = {
            newCredit : 0,
            orders : this.props.orders,
            readyBox: true,
        };
    }
    handleChange(event){
        event.persist();
        this.setState(prevState => ({newCredit : parseInt(event.target.value)}));
    }
    handleFactor(event,id){
        console.log(id)
    }
    handleSubmit(event){
        event.preventDefault();
        console.log("credit")
        console.log(this.state.newCredit)
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
		const requestOptions = {
	        method: 'POST',
	        headers: { 
	        	'content-length' : queryString.length,
	        	'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	        },
	        body: queryString
	    };
        fetch(`http://localhost:8080/Loghme/users/0`, requestOptions)
        .then(() => {
            this.setState(prevState => ({
                newCredit : 0,
                readyBox: true,    
            }))
            ReactDOM.render(<Profile />, document.getElementById("root"));
            document.getElementById("creditForm").reset()
            // toast.success("Credit increamented successfully")
        })
        .catch(function (error) {
            console.log(error);
            // toast.error("Credit increament failed")
        })
    }
    showState(props){
        if(props.state === "Searching"){
            return(
                <div class="col-md-8 offset-md-2 searchingState rounded">
                    در جست&zwnj;جوی پیک
                </div>
            )
        }
        else if(props.state === "Delivering"){
            return(
                <div class="col-md-8 offset-md-2 deliveringState rounded">
                    پیک در مسیر
                </div>
            )
        }
        else{
            return(
            <button class="deliveredState col-md-8 offset-md-2 btn btn-block rounded"  onClick={(e) => this.handleFactor(e,props.id)}>مشاهده فاکتور</button>
            )
        }
    }
    showOrder(props){
        var restaurantName = (props.order.restaurantName.length > 25) ? "..."+props.order.restaurantName.substring(0,25) : props.order.restaurantName;
        return (
            <div className="row">
                <div className="col-md-4 offset-md-1 ordersCell rounded-left">
                    <div className="row-no-padding">
                        <this.showState state={props.order.state} id={props.number-1}/>
                    </div>
                </div>
                <div className="col-md-5 ordersCell">{restaurantName}</div>
                <div className="col-md-1 ordersCell rounded-right">{String(props.number).toPersianDigits()}</div>
            </div>
        )
    }
    createTable = () => {
        let orderTable = [];
        for (let i = 0; i < this.state.orders.length; i++) {
            orderTable.push(<this.showOrder key={this.state.orders[i].id} order={this.state.orders[i]} number={i+1}/>)
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

    render(){
        if(this.props.type === "cart"){
            return(
                <form id="creditForm" onSubmit={this.handleSubmit}>
                    <div id = "infoBox" className="infoBox">
                        <ToastContainer/>
                        <SelectBar value = {this.props.type} orders={this.state.orders}/>
                        <div className="dataContainer row">
                            <div className="col-md-3 offset-md-1 increaseButtonLink">
                                {!this.state.readyBox ? ( 
                                    <button className="increaseButton btn rounded" type="submit">
                                        <span class="spinner-grow spinner-grow-sm"></span>
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
                    <SelectBar value = {this.props.type} orders={this.state.orders}/>
                    <div className="row dataContainer">
                        <this.showOrders/>
                    </div>
                </div>
            )
        }
    }
}

export default InfoBox;