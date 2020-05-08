import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import '../CSS/Normalize.css';
import '../CSS/headerStyles.css';
import '../CSS/infoBarStyles.css'
import '../CSS/basicStyles.css';
import '../CSS/footerStyles.css';
import '../CSS/restaurantStyles.css';
import '../CSS/ModalsStyles.css'
import '../media/FlatIcon/font/flaticon.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../components/Header";
import Footer from "../components/Footer";
import InfoBar from "./InfoBar";
import Cart from "./Cart";
import Authentication from "./Authentication"

String.prototype.toPersianDigits= function(){
    var id = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return this.replace(/[0-9]/g, function(w){
        return id[+w]
    });
}

class Restaurant extends React.Component {
    constructor(props){
        super(props);
        this.fetchRestaurant = this.fetchRestaurant.bind(this);
        this.showFoods = this.showFoods.bind(this);
        this.createRestaurantMenu = this.createRestaurantMenu.bind(this);
        this.showFood = this.showFood.bind(this);
        this.handleModal = this.handleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showFoodModal = this.showFoodModal.bind(this);
        this.hideFoodModal = this.hideFoodModal.bind(this);
        this.increaseOrderCount = this.increaseOrderCount.bind(this);
        this.decreaseOrderCount = this.decreaseOrderCount.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.state = {
            restaurant : "",
            foods :[],
            cart : "",
            clicked : false,
            orderCount : 0,
            ready : false,
        };
    }

    fetchRestaurant(){
        var jwtStr = localStorage.getItem("JWT") || ''
        const requestOptions = {
            method: 'GET',
            headers: new Headers({
                'Authorization': jwtStr
            })
        }
        fetch(`http://localhost:8080/Loghme/restaurants/`+ this.props.id, requestOptions)
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
                var newRestaurant = data;
                var newFoods = JSON.parse(JSON.stringify(newRestaurant.menu));
                this.setState({
                    restaurant: newRestaurant,
                    foods: newFoods,
                    ready: true,
                });
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
    
    componentDidMount() {
        var now = new Date();
        var expDate = new Date(localStorage.getItem("expDate"));
        if(now.getTime() >= expDate.getTime()) {
            localStorage.removeItem("JWT")
            localStorage.removeItem("expDate")
            ReactDOM.render(<Authentication type = {"signup"} />, document.getElementById("root"));
        }
        this.fetchRestaurant();
        window.addEventListener("click", this.hideFoodModal);
    }

    handleModal(event,props) {
        event.preventDefault()
        this.renderModal(props)
    }

    renderModal(props) {
        const modalWindow = this.showFoodModal(props);
        var modal = document.getElementById("restaurantModal");
        var content = document.getElementById("restaurantModal-content");
        content.classList.remove("zoomOut");
        content.classList.add("zoomIn");
        modal.style.display = "block";
        ReactDOM.render(modalWindow, content);
    }

    increaseOrderCount(props) {
        var newCount = this.state.orderCount + 1;
        this.setState({
            orderCount : newCount
        }, () => this.renderModal(props));
    }

    decreaseOrderCount(props) {
        var newCount = this.state.orderCount - 1;
        if (this.state.orderCount > 0) {
            this.setState({
                orderCount : newCount
            }, () => this.renderModal(props));
        } else {
            toast.error("The least possible choice!")
        }
    }

    handleSubmit(event, props){
        event.preventDefault();
        var toastId = toast.warn("Ordering your food...");
        if(this.state.orderCount === 0){
            toast.dismiss(toastId)
            toast.error("You must choose at least 1 food!")
            return
        }
        var params = {
		    "id" : this.state.restaurant.id,
		    "name" : props.name,
            "action" : "add",
            "count" : this.state.orderCount
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
        fetch('http://localhost:8080/Loghme/users/cart', requestOptions)
        .then((response) => {
            this.setState(prevState => ({
                orderCount : 0,
            }))
            this.renderModal(props)
            if (response.ok) {
                toast.dismiss(toastId)
                toast.success("Food added to your cart successfully!")
            } else {
                toast.dismiss(toastId)
                if(response.status===403){
                    if(JSON.stringify(response.json()) === "BAD_JWT") {
                        localStorage.removeItem("JWT")
                        localStorage.removeItem("expDate")
                        ReactDOM.render(<Authentication type={"signup"}/>, document.getElementById("root"));
                    }
                    toast.error("You chose your restaurant before!")
                }
            }
        })
        .then(() => {
            var modal = document.getElementById("restaurantModal");
            var content = document.getElementById("restaurantModal-content");
            content.classList.remove("zoomIn");
            content.classList.add("zoomOut");
            setTimeout(() =>{
                modal.style.display = "none";
            },200);
        })
        .catch(() =>
            toast.error("Your order could not submitted completely!")
        )
    }

    showFoodModal(props) {
        return (
            <div className="foodMoreInfoContainer food-modal-content modal-content">
                <form onSubmit={(e) => this.handleSubmit(e, props)}>
                    <div className="col-12 foodMoreInfo">
                        {this.state.restaurant.name}
                    </div>
                    <div className="row ml-0 mr-0 bottomDashedBorder">
                        <div className="col-4 pl-0 pr-1 mr-2">
                            <img className="foodBigLogo borderShadow" src={props.image}/>
                        </div>
                        <div>
                            <div className="row no-gutters">
                                <div className="col-auto foodBigName">{props.name}</div>
                                <div className="row ml-0 mr-0 justify-content-start">
                                <div className="starBigIcon text-right">&#9733;</div>
                                <div className="foodBigRate">{String(5 * props.popularity).toPersianDigits()}</div>
                                </div>
                            </div>
                            
                            <div className="row no-gutters">
                                <div className="foodDescription">{props.description}</div>
                            </div>
                
                            <div className="row no-gutters pt-3">
                                <div className="foodBigPrice pl-0 mr-0">{String(props.price).toPersianDigits()} تومان</div>
                            </div>
                        </div>
                    </div>
                    <div className="row stockContainer-big ml-0 mr-0 text-center justify-content-around">
                        <div className="col-2 align-self-center"></div>
                        <div className="row col-2 pl-0 pr-0 foodCount-big justify-content-center align-self-center">
                            <a href="#" onClick={() => this.increaseOrderCount(props)}>
                                <i className="flaticon-loghme-big-plus"></i>
                            </a>
                            <div className="mr-2 ml-2">{String(this.state.orderCount).toPersianDigits()}</div>
                            <a href="#" onClick={() => this.decreaseOrderCount(props)}>
                                <i className="flaticon-loghme-big-minus"></i>
                            </a>
                        </div>
                            <button className="col-4 buyFoodBigButton payBlueBG btn align-self-center" type="submit">اضافه&zwnj;کردن به سبد خرید</button>
                    </div>
                </form>
            </div>
        )
    }

    hideFoodModal(event) {
        var modal = document.getElementById("restaurantModal");
        var content = document.getElementById("restaurantModal-content");
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
    showFood(props){
        var foodName = (props.food.name.length > 12) ? props.food.name.substring(0,12)+"..." : props.food.name;
        return (
            <div className="col-3 menuItem pl-0 pr-0 text-center borderShadow">
                <img className="foodLogo" src={props.food.image}/>
                <div className="row no-gutters text-center foodInfo justify-content-center">
                    <div className="col-auto foodName">{foodName}</div>
                    <div className="col-auto foodRate">{String(5* props.food.popularity).toPersianDigits()}</div>
                    <div className="col-auto starIcon text-right">&#9733;</div>
                </div>
                <div className="price pl-0">{String(props.food.price).toPersianDigits()} تومان</div>
                <button id={props.food.name} className="addToCartButton btn rounded" type="submit" onClick={(e) => this.handleModal(e,props.food)}>افزودن به سبد خرید</button>
            </div>
        )
    }
    createRestaurantMenu = () => {
        const rowsNum = Math.floor(this.state.foods.length / 3);
        let menuTable = [];
    
        for (let i = 0; i < rowsNum; i++) {
            let children = []

            for (let j = 0; j < 3; j++) {
                children.push(<this.showFood key={this.state.foods[i*3+j].name} food={this.state.foods[i*3+j]} />)
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
            <ToastContainer/>
            <div className ="row justify-content-center">
            {this.state.ready?(
                <img className ="restaurantBigLogo borderShadow" src={this.state.restaurant.logo}/>
            ):(
                <span className="spinner-grow spinner-grow-sm"></span>
            )}
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
                <div id="restaurantModal" className="food-modal modal">
                    <div id="restaurantModal-content" className="row animated faster zoomIn text-center">
                    </div>
                </div>
                <Cart/>
            </div>
            <Footer/>
            </div>
        )
    }
}

Restaurant.propTypes = {
    id: PropTypes.string,
};

export default Restaurant;