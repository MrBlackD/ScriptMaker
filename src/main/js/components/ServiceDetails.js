import React from "react";
import * as funcs from "../utils/requests";
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
        funcs.get("http://localhost:8080/api/services/"+id, (response, status, statusText) => {
            let res = JSON.parse(response);
            console.log(res);
            if (status !== 200) {
                console.log(statusText);
            } else {
                this.setState({service: res});
            }
        });
    }
    renderOperations(){
        if(!this.state.service.operations){
            return null;
        }

        return this.state.service.operations.map((operation) =>{
            return <Operation data={operation}/>;
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