import React, { Component } from 'react'
import {
    Button, Divider, Grid, IconButton, List, ListItem, ListItemText, Menu, MenuItem, Paper, TextField,
    Typography
} from "material-ui";
import * as funcs from "../utils/requests";
import Node from "./Node";
import Script from "./Script";


export default class CreateOperation extends Component {
    constructor(props){
        super(props);
        this.state= {
            dynamicParams: [],
            actions: [],
            script:[],
            operation:null
        };
        this.onActionClick=this.onActionClick.bind(this);
        this.loadDynamicParams();
        this.loadActions();
    }

    loadDynamicParams(){
        funcs.get("http://localhost:8080/api/dynamicParams",(response, status, statusText)=>{
            console.log(response);
            let res = JSON.parse(response);
            console.log(res);
            if(status !== 200){
                console.log(statusText);
            } else {
                this.setState({dynamicParams: res});
            }
        });
    }

    loadActions(){
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

    renderScript(){
        return (
            <div>
                <Button color={"accent"} className={"button_fullwidth"}>
                    <Typography color={"accent"} type="headline">{this.state.operation.name}</Typography>
                </Button>
                <Divider/>
                <Script nodes={this.state.script}/>
            </div>
        );
    }

    renderOperationCreation(){
        return(
            <div className="dialog__content padding">
                <TextField inputRef={(input) => { this.name = input; }} label="name" id="name" required={true}/>
                <TextField inputRef={(input) => { this.code = input; }} label="code" id="code" required={true}/>
                <TextField inputRef={(input) => { this.module = input; }} label="module" id="module" required={true}/>
                <TextField inputRef={(input) => { this.description = input; }} label="description" id="description" required={true}/>
                <TextField inputRef={(input) => { this.inParams = input; }} label="inParams" id="inParams" />
                <TextField inputRef={(input) => { this.outParams = input; }} label="outParams" id="outParams" />
                <Button raised={true} onClick={()=>this.createOperation()}>Создать операцию</Button>
            </div>
        );
    }

    createOperation(){
        let name = this.name.value;
        this.name.value = "";
        let code = this.code.value;
        this.code.value = "";
        let description = this.description.value;
        this.description.value = "";
        let module = this.module.value;
        this.module.value = "";
        let inParams = this.inParams.value;
        this.inParams.value = "";
        let outParams = this.outParams.value;
        this.outParams.value = "";
        let operation = {name,code,description,module,inParams,outParams};
        console.log(operation);
        this.setState({operation:operation})

    }

    onActionClick(item){
            this.setState({script: [...this.state.script, item]})
    }

    onDynamicParamClick(item){
        alert("NOT IMPLEMENTED YET");
    }




    render() {

        let sidebarItems = this.state.operation?this.state.actions:this.state.dynamicParams;
        let onSidebarItemClick = this.state.operation?this.onActionClick:this.onDynamicParamClick;
        return (
            <div>
                <Grid gutter={0} container>
                    <Grid item xs={3}>
                        <Paper>
                            <Button color={"accent"} className={"button_fullwidth"}>{this.state.operation?"Действия":"Динамические параметры"}</Button>
                            <Divider/>
                            <List>
                                {
                                    sidebarItems.map((item) => {
                                        return (
                                            <ListItem button>
                                                <ListItemText primary={item.name} onClick={()=>onSidebarItemClick(item)} secondary={item.code}/>
                                            </ListItem>
                                        );
                                    })
                                }
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={9}>
                        <Paper className={"operation__script__paper"}>
                            {this.state.operation?this.renderScript():this.renderOperationCreation()}
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }

}