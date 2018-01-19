import React from "react";
import * as funcs from "../utils/requests";
import {Button, Paper} from "material-ui";

import Action from "./Action";

export default class ActionDetails extends React.Component{

    constructor(props){
        super(props);
        this.state={
            actions:{}
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        const id = this.props.params.id;
        console.log(id);
        if(!id){
            return;
        }
        funcs.get("http://localhost:8080/api/actions/"+id, (response, status, statusText) => {
            let res = JSON.parse(response);
            console.log(res);
            if (status !== 200) {
                console.log(statusText);
            } else {
                this.setState({action: res});
            }
        });
    }


    render(){
        return(
            <Paper>
                <Action data={this.state.action}/>
            </Paper>
        );
    }
}