import React from "react";
import {Button, Paper} from "material-ui";
import Operation from "./Operation";
import Service from "./Service";

export default class ServiceDetails extends React.Component{

    constructor(props){
        super(props);
        this.state={
            service:{}
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
        fetch(window.location.origin + "/api/services/"+id).then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            this.setState({service: json});
        });

    }
    renderOperations(){
        if(!this.state.service.operations){
            return null;
        }
        let serviceContext = [];
        this.state.service.inParams.forEach((paramInstance)=>{
            serviceContext.push(paramInstance.dynamicParam.code);
        });
        return this.state.service.operations.map((operation) =>{
            const currentContext = serviceContext.slice();
            operation.outParams.forEach((paramInstance)=>{
                serviceContext.push(paramInstance.dynamicParam.code);
            })
            return <Operation data={operation} context={currentContext}/>;
        })
    }
    render(){
        return(
            <Paper>
                <div style={{"text-align": "center", "padding": "10px"}}>
                    <Button raised disabled color="accent" onClick={this.openDialog}>
                        Добавить операцию
                    </Button>
                </div>
                <Service data={this.state.service}/>
                {this.renderOperations()}
            </Paper>
        );
    }
}