import React from "react";
import "./../../css/style.less";
import HeadBar from "../components/HeadBar";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {createMuiTheme} from "material-ui/styles";
import Grid from "material-ui/Grid";

const theme = createMuiTheme();

export default class Application extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        let content;
        if(this.props.children !== null){
            content = this.props.children;
        }
        return (
            <MuiThemeProvider theme={theme}>
                <div className={"root"}>
                    <HeadBar/>
                    <Grid container gutter={24}>
                        <Grid item xs={12}>
                            <div>
                                {content}
                            </div>
                        </Grid>
                    </Grid>
                </div>

            </MuiThemeProvider>
        )
    }
}
