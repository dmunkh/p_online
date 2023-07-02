import React from "react";
import ReactDOM from "react-dom";
import MainApp from "./pages/MainApp";
import "./styles/tailwind.css";

const container = document.createElement("div");
document.body.appendChild(container);
ReactDOM.render(<MainApp />, container);

