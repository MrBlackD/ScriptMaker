import React, { Component } from 'react'
import * as funcs from "../utils/requests";
import Container from "./Container";
require('jsplumb');


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
            console.log(response);
            let res = JSON.parse(response);
            console.log(res);
            if(status !== 200){
                console.log(statusText);
            } else {
                this.setState({operation: res});
                console.log("after state set");
                for(let i=0;i<10;i++){
                    jsPlumb.draggable(""+i,{anchor:"AutoDefault"});
                }
            }
        });
    }

    render() {
        let operation = this.state.operation;
        if(operation === null){
            return null;
        }
        console.log(operation);

        return (

                <div>
                    <Container data={operation}/>
                </div>


        );
    }

}