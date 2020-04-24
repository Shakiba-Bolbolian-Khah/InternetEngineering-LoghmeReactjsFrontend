import React from 'react';
import ReactDOM from 'react-dom';
import '../../CSS/Normalize.css';
import '../../CSS/basicStyles.css';
import '../../CSS/infoBarStyles.css';
import '../../CSS/homePageStyles.css';
import '../../CSS/homeSearchBar.css';
import '../../CSS/ModalsStyles.css'
import '../../media/FlatIcon/font/flaticon.css';
import Restaurant from "../Restaurant";
import Spinner from "../../components/Spinner"

class HomeRestaurants extends React.Component {
    constructor(props){
        super(props);
        this.fetchRestaurants = this.fetchRestaurants.bind(this);
        this.showRestaurants = this.showRestaurants.bind(this);
        this.showRestaurant = this.showRestaurant.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            restaurants : [],
            ready: false,
        };
    }

    fetchRestaurants(){
        const requestOptions = {
            method: 'GET'
        }
        fetch(`http://localhost:8080/Loghme/restaurants`, requestOptions)
        .then(response => response.json())
        .then(data => {
            var updatedRestaurants = data;
            this.setState({
                restaurants : updatedRestaurants,
                ready: true,
            });
        })
        
    }

    componentDidMount(){
        this.fetchRestaurants()
    }

    handleSubmit(event,id){
        event.preventDefault()
        ReactDOM.render(<Restaurant id = {id}/>, document.getElementById("root"));
    }

    showRestaurant(props){
        var restaurantName = (props.restaurant.name.length > 20) ? props.restaurant.name.substring(0,20)+"..." : props.restaurant.name;
        return (
            <div className="col-2 restaurantInfo pl-0 pr-0 text-center borderShadow">
                <img className="restaurantSmallLogo" src={props.restaurant.logo}/>
                <div className="row no-gutters justify-content-center">
                    <div className="col-auto restaurantSmallName pt-2 text-center">{restaurantName}</div>
                </div>
                <form id={props.restaurant.id} onSubmit={(e) => this.handleSubmit(e,props.restaurant.id)}>
                <button className="showMenuButton btn rounded" type="submit" >نمایش منو</button>
                </form>
            </div>
        )
    }

    createRestaurantsMenu = () => {
        const rowsNum = Math.floor(this.state.restaurants.length / 4);
        let restaurantsTable = [];
    
        for (let i = 0; i < rowsNum; i++) {
            let children = []

            for (let j = 0; j < 4; j++) {
                children.push(<this.showRestaurant key={this.state.restaurants[i*4+j].id} restaurant={this.state.restaurants[i*4+j]} />)
            }
            
            restaurantsTable.push(
                <div className="row mb-3 justify-content-center">
                    {children}
                </div>
            )
        }
        
        let children = []
        for (let i = rowsNum*4; i < this.state.restaurants.length; i++) {
            children.push(<this.showRestaurant key={this.state.restaurants[i].id} restaurant={this.state.restaurants[i]} />)
        }
        restaurantsTable.push(
            <div className="row mb-3 justify-content-center">
                {children}
            </div>
        )

        return restaurantsTable
    }

    showRestaurants(){
        return(  
            <div className="row marginFromFooter">
                <div className="col-12 restaurants justify-content-center">
                    {this.state.ready?(
                        this.createRestaurantsMenu()
                    ):(
                        <Spinner/>
                    )}
                </div>
            </div>
        )
    }

    render(){
        return(
            <div>
                <div className="row mt-4 justify-content-center">
                    <div className="row col-12 justify-content-center">
                        <div className="col-2 titles titlesUnderline pr-0 pl-0 text-center">رستوران&zwnj;ها</div>
                    </div>
                </div>
                <this.showRestaurants />
            </div>
        )
    }
}

export default HomeRestaurants;