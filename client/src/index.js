import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import ReactGA from "react-ga";
import indexRoutes from "routes/index.jsx";
//import LocalServiceWorkerRegister from "./sw-register";
import "assets/scss/material-kit-react.css?v=1.3.0";

var hist = createBrowserHistory();
ReactGA.initialize("UA-140894210-1");
//ReactGA.pageview(window.location.pathname + window.location.search);

hist.listen(location => {
  ReactGA.pageview(location.pathname + location.search);
});

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      {indexRoutes.map((prop, key) => {
        return <Route path={prop.path} key={key} component={prop.component} />;
      })}
    </Switch>
  </Router>,
  document.getElementById("root")
);
//LocalServiceWorkerRegister();
