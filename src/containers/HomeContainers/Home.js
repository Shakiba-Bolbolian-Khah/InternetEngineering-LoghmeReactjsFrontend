import React from 'react';
import ReactDOM from 'react-dom';
import '../../CSS/Normalize.css';
import '../../CSS/basicStyles.css';
import '../../CSS/infoBarStyles.css';
import '../../CSS/homePageStyles.css';
import '../../CSS/homeSearchBar.css';
import '../../CSS/ModalsStyles.css'
import '../../media/FlatIcon/font/flaticon.css';
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import InfoBar from "../InfoBar";
import FoodParty from "./FoodParty";
import HomeRestaurants from "./HomeRestaurants";
import { toast, ToastContainer } from 'react-toastify';
import Authentication from "../Authentication"

class Home extends React.Component {
    constructor(props){
        super(props);
        this.searchBar = this.searchBar.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleFoodChange = this.handleFoodChange.bind(this)
        this.handleRestaurantChange = this.handleRestaurantChange.bind(this)
        this.state = {
            foodQuery : "",
            restaurantQuery : "",
        };
    }
    componentDidMount() {
        var now = new Date();
        var expDate = new Date(localStorage.getItem("expDate"));
        console.log(now)
        console.log(expDate)
        if(now.getTime() >= expDate.getTime()) {
            localStorage.removeItem("JWT")
            localStorage.removeItem("expDate")
            ReactDOM.render(<Authentication type = {"signup"} />, document.getElementById("root"));
        }
    }
    handleFoodChange(event){
        event.persist();
        this.setState(prevState => ({foodQuery : event.target.value}));
    }
    handleRestaurantChange(event){
        event.persist();
        this.setState(prevState => ({restaurantQuery : event.target.value}));
    }
    handleSearch(event){
        event.preventDefault();
        if (this.state.foodQuery === "" && this.state.restaurantQuery === "") {
            toast.error("Please fill out at least one input box!")
        }
        else {
            ReactDOM.render(<Home type={"search"} foodValue={this.state.foodQuery} resValue={this.state.restaurantQuery}/>, document.getElementById("root"));
        }
    }
    searchBar(){
        return(
            <div className="row searchBarContents">
                <div className="col-12 justify-content-center">
                    <div className="row justify-content-center">
                        <img className="Loghme borderShadow" src={require("../../media/Pics/LOGO.png")} alt="logo"/>
                    </div>
                    <div className="row LoghmeDescribe justify-content-center">
                        اولین و بزرگ&zwnj;ترین وب&zwnj;سایت سفارش آنلاین غذا در دانشگاه تهران
                    </div>
                    <form id="searchForm" onSubmit={this.handleSearch}>
                        <div className="row justify-content-center">
                            <div className="col-6 pl-0 pr-0 searchArea borderShadow rounded text-center">
                                <div className="row justify-content-center">
                                    <div className="col-4 pl-0 pr-0">
                                        <input type="text" className="inputDesign text-center" placeholder="نــــام غـــذا" name="credit"
                                        onChange={this.handleFoodChange} />
                                    </div>
                                    <div className="col-4 pl-0 pr-0 text-center">
                                        <input type="text" className="inputDesign text-center" placeholder="نــــام رســــتـــوران" name="credit"
                                        onChange={this.handleRestaurantChange} />
                                    </div>
                                    <div className="col-3 pr-0 pl-3 text-center">
                                        <button className="serachButton btn btn-block" type="submit">جســت&zwnj;و&zwnj;جـو</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    render(){
        return(
            <div className="container-fluid loghmeContainer bg">
                { this.props.type === "normal" 
                ? <Header value = {"home"}/>
                : <Header value = {"restaurant"}/>
                }
                <InfoBar type = {"home"}/>
                <this.searchBar/>
                <ToastContainer/>
                { this.props.type === "normal" &&
                    <FoodParty />
                }
                <HomeRestaurants type={this.props.type} foodQuery={this.props.foodValue} restaurantQuery={this.props.resValue}/>
                <Footer />
            </div>
        )
    }
}

export default Home;