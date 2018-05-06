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
                            <Link className="react-router-link" to="/">SCRIPT-MAKER v0.0.6</Link>
                        </Typography>
                        <div className="appbar__menu">
                            <Link className="react-router-link" to="/dynamicParams">
                                <Button>
                                    Динамические параметры
                                </Button>
                            </Link>
                            <Link className="react-router-link" to="/actions">
                                <Button>
                                    Действия
                                </Button>
                            </Link>
                            <Link className="react-router-link" to="/operations">
                                <Button>
                                    Операции
                                </Button>
                            </Link>
                            <Link className="react-router-link" to="/services">
                                <Button>
                                    Сервисы
                                </Button>
                            </Link>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}