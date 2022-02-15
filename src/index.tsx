import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import HomePage from "./pages/HomePage/HomePage";
import reportWebVitals from "./reportWebVitals";

import { HashRouter, Route, Switch } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
