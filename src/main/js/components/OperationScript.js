import React, { Component } from 'react'
import * as funcs from "../utils/requests";
import Operation from "./Operation";
import Action from "./Action";


export default class OperationScript extends Component {
    constructor(props){
        super(props);
        this.state={
            operation:{}
        }
    }

    componentDidMount() {
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
            }
        });
    }

    renderScript(operation) {
        let res = [];
        res.push(<td><Operation data={operation}/></td>);
        let node = operation.startNode;
        let condition = false;
        while(node){
            if(!node.condition){
                res.push(<td><Action data={node.action}/></td>);
            } else {
                res.push(<td><Action data={node.condition.isTrueNode}/></td>);
                condition = true;
            }
            node = node.nextNode;
        }
        res.push(<td><div className="end operation">OPERATION END</div></td>);
        return res;
    }


    render() {

        let operation = this.state.operation;
        console.log(operation);
        return (
            <table className="operationScript">
                <tbody>
                    <tr>
                        {this.renderScript(operation)}
                    </tr>
                </tbody>
            </table>
        );
    }

}