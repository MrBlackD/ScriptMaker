import React from "react";
import * as funcs from "../utils/requests";
import {Button, Paper} from "material-ui";
import Operation from "./Operation";
import Action from "./Action";

export default class OperationDetails extends React.Component{

    constructor(props){
        super(props);
        this.state={
            operation:{}
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
        funcs.get("http://localhost:8080/api/operations/"+id, (response, status, statusText) => {
            let res = JSON.parse(response);
            console.log(res);
            if (status !== 200) {
                console.log(statusText);
            } else {
                this.setState({operation: res});
            }
        });
    }

    renderActions(){
        if(!this.state.operation.actions){
            return null;
        }

        return this.state.operation.actions.map((action) =>{
            return <Action data={action}/>;
        })
    }


    render(){
        return(
            <Paper>
                <div style={{"text-align": "center", "padding": "10px"}}>
                    <Button raised disabled color="accent" onClick={this.openDialog}>
                        Добавить действие
                    </Button>
                </div>
                <Operation data={this.state.operation}/>
                {this.renderActions()}
            </Paper>
        );
    }
}