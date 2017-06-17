import React, { Component } from 'react'
import * as funcs from "../utils/requests";
import Action from "./Action";

export default class Actions extends Component {
    constructor(props){
        super(props);
        this.state = {
            actions:{}
        }
    }
    componentDidMount() {
        this.loadData();
    }

    loadData(){
        funcs.get("http://localhost:8080/api/actions",(response, status, statusText)=>{
            console.log(response);
            let res = JSON.parse(response);
            console.log(res);
            if(status !== 200){
                console.log(statusText);
            } else {
                this.setState({actions: res});
            }
        });
    }

    renderActions(){
        let params = this.state.actions;
        let actions = [];
        for(let i = 0;i < params.length; i++){
            actions.push(<Action key={i} data={params[i]}/>);
        }
        return actions;
    }

    render() {

        return (
            <div>
                <h2>Actions</h2>
                {this.renderActions()}
            </div>
        )
    }

}