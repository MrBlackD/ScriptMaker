import React from "react";
import {Paper} from "material-ui";

import Action from "./Action";

export default class ActionDetails extends React.Component{

    constructor(props){
        super(props);
        this.state={
            action:{}
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
        fetch("http://localhost:8080/api/actions/"+id).then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            this.setState({action: json});
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