import React, { Component } from 'react'
import { Link } from 'react-router'
import { createStyleSheet } from 'material-ui/styles';
import AppBar from "material-ui/AppBar/AppBar";
import {Button, Toolbar, Typography} from "material-ui";


const styleSheet = createStyleSheet('SimpleAppBar', {
    root: {
        marginTop: 30,
        width: '100%',
    },
    flex:{
        flex:1
    }
});

export default class HeadBar extends Component {
    render() {
        return (
            <div className={styleSheet.root}>
                <AppBar position="static" color="primary">
                    <Toolbar >
                        <Typography type="title">
                            <Link className="react-router-link" to="/">ScriptMaker v0.0.1</Link>
                        </Typography>
                        <div className="appbar__menu">
                            <Button>
                                <Link  className="react-router-link" to="/dynamicParams">Динамические параметры</Link>
                            </Button>
                            <Button>
                                <Link className="react-router-link" to="/actions">Действия</Link>
                            </Button>
                            <Button>
                                <Link className="react-router-link" to="/operations">Операции</Link>
                            </Button>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}