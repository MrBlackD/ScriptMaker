import React from "react";
import {IndexRoute, Route} from "react-router";

import Application from "./containers/Application";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import DynamicParams from "./components/DynamicParams";
import Actions from "./components/Actions";
import Operations from "./components/Operations";
import OperationScript from "./components/OperationScript";
import CreateOperation from "./components/CreateOperation";
import OperationDetails from "./components/OperationDetails";

export const routes = (
    <div>
        <Route path='/' component={Application}>
            <IndexRoute component={Home} />
            <Route path="/dynamicParams" component={DynamicParams} />
            <Route path="/actions" component={Actions} />
            <Route path="/operations" component={Operations} />
            <Route path="/operations/:id" component={OperationDetails} />
            <Route path="/operationScript" component={CreateOperation} />
            <Route path="/operationScript/:id" component={OperationScript} />
        </Route>
        <Route path='*' component={NotFound} />
    </div>
);