import React from 'react';
import ReactDOM from 'react-dom';
import Home from "./containers/HomeContainers/Home"
import Authentication from "./containers/Authentication"

if (localStorage.getItem("JWT") !== null) {
    var now = new Date();
    var expDate = new Date(localStorage.getItem("expDate"));
    if(now.getTime() <= expDate.getTime()) {
        ReactDOM.render(<Home type={"normal"}/>, document.getElementById("root"));
    }
    else {
        ReactDOM.render(<Authentication type = {"signup"} />, document.getElementById("root"));
    }
}
else {
    ReactDOM.render(<Authentication type = {"signup"} />, document.getElementById("root"));
}