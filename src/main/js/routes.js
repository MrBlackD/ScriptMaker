import React from "react";
import {IndexRoute, Route} from "react-router";

import Application from "./containers/Application";
import Home from "./components/Home/Home";
import NotFound from "./components/NotFound";
import DynamicParams from "./components/DynamicParams";
import Actions from "./components/Actions";
import Operations from "./components/Operations";
import OperationScript from "./components/OperationScript";
import CreateOperation from "./components/CreateOperation";
import OperationDetails from "./components/OperationDetails";
import ActionDetails from "./components/ActionDetails";
import ServiceDetails from "./components/ServiceDetails";
import Services from "./components/Services";

export const routes = (
    <div>
        <Route path='/' component={Application}>
            <IndexRoute component={Home} />
            <Route path="/dynamicParams" component={DynamicParams} />
            <Route path="/actions" component={Actions} />
            <Route path="/operations" component={Operations} />
            <Route path="/actions/:id" component={ActionDetails} />
            <Route path="/operations/:id" component={OperationDetails} />
            <Route path="/services/:id" component={ServiceDetails} />
            <Route path="/operationScript" component={CreateOperation} />
            <Route path="/operationScript/:id" component={OperationScript} />
            <Route path="/services" component={Services} />
        </Route>
        <Route path='*' component={NotFound} />
    </div>
);