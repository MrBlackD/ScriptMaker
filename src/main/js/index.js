import React from "react";
import {render} from "react-dom";
import {hashHistory, Router} from "react-router";
import {Provider} from "react-redux";
import {routes} from "./routes";
import store from "./store/store";

render(
    <Provider store={store}>
        <Router history={hashHistory} routes={routes} />
    </Provider>,
    document.getElementById('root')
);