import React, { Component } from 'react'
import * as funcs from "../utils/requests.js";
import Container from "./Container";
import {Paper} from "material-ui";


export default class OperationScript extends Component {
    constructor(props){
        super(props);


        this.state={
            operation:null
        };
    }
    componentWillMount(){
        this.loadData();

    }

    loadData(){

        funcs.get("http://localhost:8080/api/operations/"+this.props.params.id,(response, status, statusText)=>{
            let res = JSON.parse(response);
            console.log(res);
            if(status !== 200){
                console.log(statusText);
            } else {
                this.setState({operation: res});
            }
        });
    }

    render() {
        let operation = this.state.operation;
        if(operation === null){
            return null;
        }

        return (
                <Paper>
                    <Container data={operation}/>
                </Paper>
        );
    }

}