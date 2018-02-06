import React, {Component} from "react";
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
        fetch(window.location.origin + "/api/operations/"+this.props.params.id).then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            this.setState({operation: json});
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