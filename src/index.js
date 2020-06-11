import React from 'react';
import ReactDOM from 'react-dom';
import Home from "./containers/HomeContainers/Home"
import Authentication from "./containers/Authentication"

console.log("ghable if 1")
console.log(localStorage.getItem("JWT"))
if (localStorage.getItem("JWT") !== null) {
    console.log("bade if 1")
    console.log(localStorage.getItem("JWT"))
    var now = new Date();
    var expDate = new Date(localStorage.getItem("expDate"));
    if(now.getTime() <= expDate.getTime()) {
        console.log("bade if 2")
        console.log(localStorage.getItem("JWT"))
        ReactDOM.render(<Home type={"normal"}/>, document.getElementById("root"));
    }
    else {
        ReactDOM.render(<Authentication type = {"signup"} />, document.getElementById("root"));
    }
}
else {
    ReactDOM.render(<Authentication type = {"signup"} />, document.getElementById("root"));
}