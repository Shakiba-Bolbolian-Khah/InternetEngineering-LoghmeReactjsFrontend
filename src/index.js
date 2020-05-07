import React from 'react';
import ReactDOM from 'react-dom';
import Home from "./containers/HomeContainers/Home"
import Authentication from "./containers/Authentication"

// ========================================

// ReactDOM.render(<Home type={"normal"}/>, document.getElementById("root"));
ReactDOM.render(<Authentication type = {"signup"} />, document.getElementById("root"));