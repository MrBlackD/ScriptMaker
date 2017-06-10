import React from 'react'
import { Route, IndexRoute } from 'react-router'

import Application from './containers/Application'
import Home from './components/Home'
import NotFound from './components/NotFound'
import DynamicParams from "./components/DynamicParams";

export const routes = (
    <div>
        <Route path='/' component={Application}>
            <IndexRoute component={Home} />
            <Route path="/dynamicParams" component={DynamicParams} />
        </Route>
        <Route path='*' component={NotFound} />
    </div>
);