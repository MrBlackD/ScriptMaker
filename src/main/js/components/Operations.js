import React, { Component } from 'react'
import * as funcs from "../utils/requests";
import Operation from "./Operation";


export default class Operations extends Component {
    constructor(props){
        super(props);
        this.state = {
            operations:{}
        }

    }
    componentDidMount() {
        this.loadData();
    }

    loadData(){
        funcs.get("http://localhost:8080/api/operations",(response, status, statusText)=>{
            console.log(response);
            let res = JSON.parse(response);
            console.log(res);
            if(status !== 200){
                console.log(statusText);
            } else {
                this.setState({operations: res});
            }
        });
    }
    renderOperations(){
        let params = this.state.operations;
        let operations = [];
        for(let i = 0;i < params.length; i++){
            operations.push(<Operation key={i} data={params[i]}/>);
        }
        return operations;
    }

    render() {

        return (
            <div>
                <h2>Operations</h2>
                {this.renderOperations()}
            </div>
        );
    }

}