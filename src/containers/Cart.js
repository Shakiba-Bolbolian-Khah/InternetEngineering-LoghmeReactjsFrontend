import React from 'react';
import PropTypes from 'prop-types';
import '../CSS/Normalize.css';
import '../CSS/basicStyles.css';
import '../CSS/restaurantStyles.css';
import '../CSS/ModalsStyles.css';
import '../media/FlatIcon/font/flaticon.css';
import Spinner from "../components/Spinner";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

String.prototype.toPersianDigits= function(){
    var id = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return this.replace(/[0-9]/g, function(w){
        return id[+w]
    });
}

class Cart extends React.Component {
    constructor(props){
        super(props)
        this.fetchCart = this.fetchCart.bind(this)
        this.showAddedFood = this.showAddedFood.bind(this)
        this.createCart = this.createCart.bind(this)
        this.showCart = this.showCart.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.addFood = this.addFood.bind(this)
        this.deleteFood = this.deleteFood.bind(this)
        this.state = {
            cart : "",
            ready : false,
            isEmpty : true,
        }
    }
    fetchCart(){
        const requestOptions = {
            method: 'GET'
        }
        fetch(`http://localhost:8080/Loghme/users/cart?userId=0`, requestOptions)
        .then(response => response.json())
        .then(data => {
            var newCart = data;
            this.setState({
                cart: newCart,
                ready: true,
                isEmpty : false,
                buttonReady: true,
            });
        })
        .catch(error => {
            this.setState({
                ready: true,
                isEmpty : true,
                buttonReady: true,
            });
        })
    }
    handleSubmit(event){
        event.preventDefault()
        this.setState(prevState => ({buttonReady:false}));
        var toastId = toast.warn("Finalizing your order!..")
        var params = {
		    "userId": 0,
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
        fetch('http://localhost:8080/Loghme/users/finalize', requestOptions)
        .then((response) => {
            this.setState(prevState => ({
                buttonReady:true,
            }))
            if (response.ok) {
                toast.dismiss(toastId)
                toast.success("Your order finalized successfully!")
            } else {
                toast.dismiss(toastId)
                if(response.status===403){
                    toast.error("Party food time is over!")
                }
                if(response.status===400){
                    toast.error("Not enough credit!")
                }
            }
        })
        .catch(() =>{
            toast.error("You can not finalize your order!")
            this.setState(prevState => ({
                buttonReady:true,
            }))
        }
        )
    }
    componentDidMount(){
        this.fetchCart()
        this.timerId = setInterval(
    		() => {this.fetchCart()}
    		, 10000
        );
    }
    deleteFood(event, index){
        event.preventDefault()
        var item = this.state.cart.items[index]
        var toastId = toast.warn("Deleting "+item.foodName+" to your cart!..")
        var params = {
            "userId": 0,
		    "id" : this.state.cart.restaurantId,
		    "name" : item.foodName,
            "action" : "delete",
            "count" : 1,
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
        if(item.partyFood){
            fetch('http://localhost:8080/Loghme/foodparty', requestOptions)
            .then((response) => {
                if (response.ok) {
                    toast.dismiss(toastId)
                    toast.success("Party food deleted from your cart successfully!")
                } else {
                    toast.dismiss(toastId)
                    if(response.status===403){
                        toast.error("Party food time is over!")
                    }
                }
            })
            .catch(() =>{
                toast.dismiss(toastId)
            })
        }
        else{
            fetch('http://localhost:8080/Loghme/users/cart', requestOptions)
            .then((response) => {
                if (response.ok) {
                    toast.dismiss(toastId)
                    toast.success("Food deleted from your cart successfully!")
                } else {
                    toast.dismiss(toastId)
                    toast.error("You can not order this food again!")
                }
            })
            .catch(() =>{
                toast.dismiss(toastId)
            })
        }
    }
    addFood(event, index){
        event.preventDefault();
        var item = this.state.cart.items[index]
        var toastId = toast.warn("Adding "+item.foodName+" to your cart!..")
        var params = {
            "userId": 0,
		    "id" : this.state.cart.restaurantId,
		    "name" : item.foodName,
            "action" : "add",
            "count" : 1,
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
        if(item.partyFood){
            fetch('http://localhost:8080/Loghme/foodparty', requestOptions)
            .then((response) => {
                if (response.ok) {
                    toast.dismiss(toastId)
                    toast.success("Party food added to your cart successfully!")
                } else {
                    toast.dismiss(toastId)
                    if(response.status===404){
                        toast.error("Party food time is over!")
                    }
                    if(response.status===403){
                        toast.error("There is no more "+item.foodName+"in foodparty!")
                    }
                }
            })
            .catch(() =>{
                toast.dismiss(toastId)
            })
        }
        else{
            fetch('http://localhost:8080/Loghme/users/cart', requestOptions)
            .then((response) => {
                if (response.ok) {
                    toast.dismiss(toastId)
                    toast.success("Food added to your cart successfully!")
                } else {
                    toast.dismiss(toastId)
                    toast.error("You can not order this food again!")
                }
            })
            .catch(() =>{
                toast.dismiss(toastId)
            })
        }
    }
    showAddedFood(props){
        var price = parseInt(props.price)*parseInt(props.number)
        var foodName = (props.foodName.length > 8) ? props.foodName.substring(0,8)+"..." : props.foodName;
        return (
            <div>
                <div className="firstItem shoppingCartItem justify-content-around">
                    <div className="col-7 text-right">{foodName}</div>
                    <div className="col-5">
                        <a href="#" onClick={(event) => this.deleteFood(event,props.index)}>
                            <i className="flaticon-loghme-minus"></i>
                        </a>
                        {String(props.number).toPersianDigits()}
                        <a href="#" onClick={(event) => this.addFood(event,props.index)}>
                            <i className="flaticon-loghme-plus"></i>
                        </a>
                    </div>
                </div>
                <div className="price priceUnderline">{String(price).toPersianDigits()} تومان</div>
            </div>
        )
    }

    createCart = () => {
        let cartTable = [];
        for (let i = 0; i < this.state.cart.items.length; i++) {
            cartTable.push(<this.showAddedFood key={this.state.cart.items[i].foodName} index={i} foodName={this.state.cart.items[i].foodName} 
                number={this.state.cart.items[i].number} price={this.state.cart.items[i].price} />)
        }

        return cartTable
    }
    showCart(){
        return( 
            <div className="shoppingCartContents">
                {this.createCart()}
            </div> 
            
        )
    }

    render(){
        if(!this.state.ready){
            return(
            <div className="col-3 align-self-start justify-content-center shoppingCart borderShadow">
                <div className="shoppingCartText text-center">سبد خرید</div>
                <div className="shoppingCartContents">
                    <Spinner/>
                </div>
            </div>
            )
        }
        else{
            console.log(this.state.cart);
            if(this.state.isEmpty === true){
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
                <this.showCart/>
                <div className="row justify-content-center">
                    <div className="totalPriceText">جمع کل:</div>
                    <div className="totalPriceValue">{String(this.state.cart.totalPayment).toPersianDigits()} تومان</div>
                </div>
                <div className="row justify-content-center">
                    <button className="col-6 pl-1 pr-1 text-center btn submitButton" type="submit"  onClick={(e) => this.handleSubmit(e)}>
                        تایید نهایی
                    </button>
                </div>
                </div>
                )
            } 
        }     
    }
}

export default Cart;