import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import '../../CSS/Normalize.css';
import '../../CSS/basicStyles.css';
import '../../CSS/infoBarStyles.css';
import '../../CSS/homePageStyles.css';
import '../../CSS/homeSearchBar.css';
import '../../CSS/ModalsStyles.css'
import '../../media/FlatIcon/font/flaticon.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Authentication from "../Authentication"

String.prototype.toPersianDigits= function(){
    var id = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return this.replace(/[0-9]/g, function(w){
        return id[+w]
    });
}

class FoodParty extends React.Component {
    constructor(props){
        super(props);
        this.fetchParty = this.fetchParty.bind(this);
        this.remainingTime = this.remainingTime.bind(this);
        this.showPartyFoods = this.showPartyFoods.bind(this);
        this.showPartyFood = this.showPartyFood.bind(this);
        this.handleModal = this.handleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showPartyFoodBuyModal = this.showPartyFoodBuyModal.bind(this);
        this.hidePartyFoodBuyModal = this.hidePartyFoodBuyModal.bind(this);
        this.increaseOrderCount = this.increaseOrderCount.bind(this);
        this.decreaseOrderCount = this.decreaseOrderCount.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.state = {
            partyFoods : [],
            date : "",
            orderCount : 0,
            ready : false,
            timer : false,
        };
    }

    fetchParty(){
        var jwtStr = localStorage.getItem("JWT") || ''
        const requestOptions = {
            method: 'GET',
            headers: new Headers({
                'Authorization': jwtStr
            })
        }
        fetch(`http://ie.etuts.ir:31664/Loghme/foodparty`, requestOptions)
        .then(response => response.json())
        .then(data => {
            if(JSON.stringify(data) === "BAD_JWT"){
                localStorage.removeItem("JWT")
                localStorage.removeItem("expDate")
                clearInterval(this.timerId)
                clearInterval(this.timerTime)
                ReactDOM.render(<Authentication type={"signup"}/>, document.getElementById("root"));
            }
            else if(data !== undefined){
                var updatedParty = data;
                var date = JSON.parse(JSON.stringify(updatedParty.enteredDate));
                const enteredDate = (date!== null) ? new Date(date.year,date.monthValue-1, date.dayOfMonth, date.hour, date.minute, date.second, 0)
                : "";
                var foods = JSON.parse(JSON.stringify(updatedParty.partyFoods));
                this.setState({
                    partyFoods : foods,
                    date : enteredDate,
                    ready: true,
                });
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    componentDidMount() {
        this.fetchParty()
        this.timerId = setInterval(
    		() => {this.fetchParty()}
    		, 10000
        );
        this.timerTime = setInterval(() => {
            this.setState({ timer : true })
            this.remainingTime()}
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
            toast.error("There is no more available food!")
        }
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
        event.preventDefault()
        var toastId = toast.warn("Ordering your food...");
        if(this.state.orderCount === 0){
            toast.dismiss(toastId);
            toast.error("You must choose at least 1 food!")
            return
        }
        var params = {
		    "id" : props.restaurantId,
		    "name" : props.name,
            "action" : "add",
            "count" : this.state.orderCount,
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
        fetch('http://ie.etuts.ir:31664/Loghme/foodparty', requestOptions)
        .then((response) => {
            this.setState(prevState => ({
                orderCount : 0,
            }))
            this.renderModal(props)
            if (response.ok) {
                toast.dismiss(toastId);
                toast.success("Food added to your cart successfully!")
            } else {
                toast.dismiss(toastId)
                if(response.status===403){
                    if(JSON.stringify(response.json()) === "BAD_JWT") {
                        localStorage.removeItem("JWT")
                        localStorage.removeItem("expDate")
                        clearInterval(this.timerId)
                        clearInterval(this.timerTime)
                        ReactDOM.render(<Authentication type={"signup"}/>, document.getElementById("root"));
                    }
                    toast.error("You chose your restaurant before or food is over!")
                }
            }
        })
        .then(() => {
            var modal = document.getElementById("partyFoodsModal");
            var content = document.getElementById("partyFoodsModal-content");
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

    showPartyFoodBuyModal(props) {
        var count = (props.count == 0) ? "ناموجود" : "موجودی: "+String(props.count).toPersianDigits();
        return (
            <div className="foodMoreInfoContainer food-modal-content modal-content">
                <form onSubmit={(e) => this.handleSubmit(e, props)}>
                    <div className="col-12 foodMoreInfo">
                        {props.restaurantName}
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
                        <button className="col-4 buyFoodBigButton payBlueBG btn align-self-center" type="submit">افزودن به سبد خرید</button>
                    </div>
                </form>
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
                    <img className="partyFoodLogo" src={props.partyFood.image}/>
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
        var min;
        var sec;
        if(this.state.date !== "" ){
            var now = new Date()
            var remainedTime = 30*60000-(now.getTime() - this.state.date.getTime())
            min = Math.floor(remainedTime / 60000)
            sec = Math.floor((remainedTime - min*60000) / 1000)
            if (min < 0 || sec < 0){
                min = 0
                sec = 0
                this.fetchParty()
            }
        }
        else{
            min = "00"
            sec = "00"
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
                <ToastContainer/>
                <div className="row col-12 justify-content-center">
                    <div className="col-2 titles titlesUnderline pr-0 pl-0 text-center">جشن غذا!</div>
                </div>
                <this.remainingTime />
                <div className="col-12 foodPartyMenu borderShadow text-center">
                    {this.state.ready &&
                        <this.showPartyFoods />
                    }
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
        clearInterval(this.timerTime)
    }
}

export default FoodParty;