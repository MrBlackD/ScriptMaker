import React from "react";
import "./../../css/style.less";
import "./../../css/autoSuggest.less";
import HeadBar from "../components/HeadBar";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Grid from "material-ui/Grid";
import {createMuiTheme} from "material-ui/styles";

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#757ce8',
            main: '#3f50b5',
            dark: '#002884',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff7961',
            main: '#f44336',
            dark: '#ba000d',
            contrastText: '#000',
        },
    },
});

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
