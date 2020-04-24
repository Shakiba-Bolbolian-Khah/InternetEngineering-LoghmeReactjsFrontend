import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import '../CSS/Normalize.css';
import '../CSS/headerStyles.css';
import '../CSS/basicStyles.css';
import '../CSS/ModalsStyles.css'
import '../media/FlatIcon/font/flaticon.css';
import Home from "../containers/HomeContainers/Home"
import Profile from "../containers/Profile"
import Authentication from "../containers/Authentication"
import Cart from "../containers/Cart"

class Header extends React.Component {
    constructor(props){
        super(props);
        this.handleCart= this.handleCart.bind(this)
        this.renderCart = this.renderCart.bind(this)
        this.showCart = this.showCart.bind(this)
        this.hideCart = this.hideCart.bind(this)
    }
    componentDidMount(){
        window.addEventListener("click", this.hideCart);
    }
    goHome(event){
        event.preventDefault();
        ReactDOM.render(<Home type={"normal"}/>, document.getElementById("root"));
    }
    goProfile(event){
        event.preventDefault();
        ReactDOM.render(<Profile type={"cart"}/>, document.getElementById("root"));
    }
    logout(event){
        event.preventDefault();
        ReactDOM.render(<Authentication type = {"signup"} />, document.getElementById("root"));
    }

    handleCart(event){
        event.preventDefault();
        this.renderCart()
    }
    renderCart() {
        const modalWindow = this.showCart();
        var modal = document.getElementById("cartModal");
        var content = document.getElementById("cartModal-content");
        content.classList.remove("zoomOut");
        content.classList.add("zoomIn");
        modal.style.display = "block";
        ReactDOM.render(modalWindow, content);
    }
    showCart() {
        return (
            <Cart/>
        )
    }
    hideCart(event) {
        var modal = document.getElementById("cartModal");
        var content = document.getElementById("cartModal-content");
        if (event.target == modal || event.target == content) {
            content.classList.remove("zoomIn");
            content.classList.add("zoomOut");
            setTimeout(() =>{
                modal.style.display = "none";
            },200);
        }
    }
    render(){
        return (
            <div className="row header">
                <div className="headerLeftSide">
                    <div className="exitContainer">
                        <a className="exit" href="#" onClick={(e) => this.logout(e)}>خروج</a>
                    </div>
                    {this.props.value !== "profile" && this.props.value !== "cart" && this.props.value !== "order" &&
                        <div className="userProfileContainer">
                            <a className="userProfile" href="#" onClick={(e) => this.goProfile(e)}>حساب کاربری</a>
                        </div>
                    }
                    <div className="cartIconContainer">
                        <a href="#" onClick={(e) => this.handleCart(e)}>
                            <i className="flaticon-loghme-smart-cart"></i>
                        </a>
                    </div>
                </div>
                <div id="cartModal" className="cart-modal modal">
                    <div id="cartModal-content" className="row justify-content-center animated faster zoomIn text-center">
                    </div>
                </div>
                {this.props.value !== "home" &&
                    <div className="LoghmeLogoContainer">
                        <a href="#" onClick={(e) => this.goHome(e)}>
                            <img className="LoghmeLogo" src={require('../media/Pics/LOGO.png')} alt="logo"/>
                        </a>
                    </div>
                }
            </div>
        )
    }
}

Header.propTypes = {
    type: PropTypes.string,
};

Header.defaultProps = {
    value: 'home'
}
export default Header;