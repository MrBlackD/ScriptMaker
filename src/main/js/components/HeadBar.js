import React, {Component} from "react";
import {Link} from "react-router";
import AppBar from "material-ui/AppBar/AppBar";
import {Button, Toolbar, Typography} from "material-ui";


export default class HeadBar extends Component {
    render() {
        return (
            <div className={"headbar_root"}>
                <AppBar position="static" color="primary">
                    <Toolbar >
                        <Typography variant="title">
                            <Link className="react-router-link" to="/">SCRIPT-MAKER</Link>
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
                            <Button>
                                <Link className="react-router-link" to="/services">Сервисы</Link>
                            </Button>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}