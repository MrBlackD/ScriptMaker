import React from "react";
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
        fetch("http://localhost:8080/api/operations/"+id).then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            this.setState({operation: json});
        });

    }

    renderActions(){
        if(!this.state.operation.actions){
            return null;
        }
        let operationContext = [];
        this.state.operation.inParams.forEach((paramInstance)=>{
            operationContext.push(paramInstance.dynamicParam.code);
        });
        return this.state.operation.actions.map((actionInstance) =>{
            const currentContext = operationContext.slice();
            actionInstance.action.outParams.forEach((paramInstance)=>{
                operationContext.push(paramInstance.dynamicParam.code);
            })
            return <Action data={actionInstance.action} mapping={actionInstance.mapping} context={currentContext}/>;
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