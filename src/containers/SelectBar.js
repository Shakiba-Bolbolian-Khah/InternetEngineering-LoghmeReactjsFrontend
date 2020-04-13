import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import '../CSS/Normalize.css';
import '../CSS/basicStyles.css';
import '../CSS/profileStyles.css';
import InfoBox from "./InfoBox";

class SelectBar extends React.Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this)
        this.state = {
            orders : this.props.orders,
        }
    }

    handleClick(event, page){
        event.preventDefault();
        ReactDOM.render(<InfoBox type = {page} orders={this.state.orders}/>, document.getElementById("creditForm"));
    }

    render(){
        // console.log("orders-select bar")
        // console.log(this.state.orders)
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

export default SelectBar;