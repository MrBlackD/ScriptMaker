import React, { Component } from 'react'
import { Link } from 'react-router'

export default class HeadBar extends Component {
    render() {
        return (
            <div>
                <ul>
                    <li><Link to="/dynamicParams">dynamicParams</Link></li>
                    <li><Link to="/actions">Actions</Link></li>
                    <li><Link to="/">Root</Link></li>
                </ul>
            </div>
        )
    }
}