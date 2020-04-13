import React from 'react';
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

class Home extends React.Component {
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

export default Home;