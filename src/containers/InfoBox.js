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

class InfoBox extends React.Component {
    constructor(props){
        super(props);
// hamed delete        console.log(props.ready)
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            newCredit : 0,
            orders : [],
            readyBox: true,
        };
    }

    handleChange(event){
        event.persist();
        this.setState(prevState => ({newCredit : parseInt(event.target.value)}));
    }

    handleSubmit(event){
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
// hamed            toast.success("Credit increamented successfully")
        })
        .catch(function (error) {
            console.log(error);
// hamed            toast.error("Credit increament failed")
        })
    }

    render(){
        if(this.props.type === "cart"){
            return(
                <form id="creditForm" onSubmit={this.handleSubmit}>
                    <div id = "infoBox" className="infoBox">
                        <ToastContainer/>
                        <SelectBar value = {this.props.type}/>
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

export default InfoBox;