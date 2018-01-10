import React from 'react'
import HeadBar from "../components/HeadBar";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {createMuiTheme}  from 'material-ui/styles';
import createPalette from 'material-ui/styles/createPalette';
import {createStyleSheet} from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import cyan from 'material-ui/colors/cyan';
import blue from 'material-ui/colors/blue';
import red from 'material-ui/colors/red';


const styleSheet = createStyleSheet('FullWidthGrid', theme => ({
    root: {
        flexGrow: 1,
        marginTop: 30,
    },
    paper: {
        padding: 16,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

const theme = createMuiTheme({
    palette: createPalette({
        primary: {
            ...cyan,
            500:cyan[200]
        },
        accent: {
            ...blue
        },
        error:red
    }),
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
                <div className={styleSheet.root}>
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
