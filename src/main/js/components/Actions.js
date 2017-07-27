import React, { Component } from 'react'
import * as funcs from "../utils/requests";
import Action from "./Action";
import {Button, TextField, Typography} from "material-ui";

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

    handleCreateParam(e){
        e.preventDefault();

        let name = this.newName.value;
        this.newName.value = "";
        let code = this.newCode.value;
        this.newCode.value = "";
        let module = this.newModule.value;
        this.newModule.value = "";
        let description = this.newDescription.value;
        this.newDescription.value = "";
        let inParams = this.newInParams.value;
        this.newInParams.value = "";
        let outParams = this.newOutParams.value;
        this.newOutParams.value = "";
        console.log(name+" "+code+" "+module+" "+description+" "+inParams+" "+outParams);
        let url = "http://localhost:8080/api/actions/new?"
            +"name="+name
            +"&code="+code
            +"&module="+module
            +"&description="+description;
            if(inParams){
                url+="&inParams="+inParams;
            }
            if(outParams){
                url+="&outParams="+outParams;
            }

        funcs.get(url,(response, status, statusText)=>{
            console.log(response);
            console.log(statusText);
            this.loadData();
        });
    }

    handleEditParam(e){
        e.preventDefault();

        let id = this.editId.value;
        this.editId.value = "";
        let name = this.editName.value;
        this.editName.value = "";
        let code = this.editCode.value;
        this.editCode.value = "";
        let module = this.editModule.value;
        this.editModule.value = "";
        let description = this.editDescription.value;
        this.editDescription.value = "";
        let inParams = this.editInParams.value;
        this.editInParams.value = "";
        let outParams = this.editOutParams.value;
        this.editOutParams.value = "";
        console.log(id+" "+name+" "+code+" "+module+" "+description+" "+inParams+" "+outParams);
        let url = "http://localhost:8080/api/actions/edit?"
            +"id="+id;
        if(name){
            url+="&name="+name;
        }
        if(code){
            url+="&code="+code;
        }
        if(module){
            url+="&module="+module;
        }
        if(description){
            url+="&description="+description;
        }
        if(inParams){
            url+="&inParams="+inParams;
        }
        if(outParams){
            url+="&outParams="+outParams;
        }

        funcs.get(url,(response, status, statusText)=>{
            console.log(response);
            console.log(statusText);
            this.loadData();
        });

    }

    handleDelete(e){
        e.preventDefault();
        let id = this.deleteId.value;
        this.deleteId.value = "";
        let url = "http://localhost:8080/api/actions/delete?id="+id;
        funcs.get(url,(response, status, statusText)=>{
            console.log(response);
            console.log(statusText);
            this.loadData();
        });
    }

    renderForms(){
        return (
            <div>
                <form onSubmit={(e)=>this.handleCreateParam(e)}>
                    <TextField inputRef={(input) => { this.newName = input; }} label="name" id="newName" required={true}/>
                    <TextField inputRef={(input) => { this.newCode = input; }} label="code" id="newCode" required={true}/>
                    <TextField inputRef={(input) => { this.newModule = input; }} label="module" id="newModule" required={true}/>
                    <TextField inputRef={(input) => { this.newDescription = input; }} label="description" id="newDescription" required={true}/>
                    <TextField inputRef={(input) => { this.newInParams = input; }} label="inParams" id="newInParams" />
                    <TextField inputRef={(input) => { this.newOutParams = input; }} label="outParams" id="newOutParams" />
                    <Button raised={true} type="submit">Create new</Button>
                </form>
                <form onSubmit={(e)=>this.handleEditParam(e)}>
                    <TextField inputRef={(input) => { this.editId = input; }} label="id" id="editId" required={true}/>
                    <TextField inputRef={(input) => { this.editName = input; }} label="name" id="editName"/>
                    <TextField inputRef={(input) => { this.editCode = input; }} label="code" id="editCode"/>
                    <TextField inputRef={(input) => { this.editModule = input; }} label="module" id="editModule"/>
                    <TextField inputRef={(input) => { this.editDescription = input; }} label="description" id="editDescription"/>
                    <TextField inputRef={(input) => { this.editInParams = input; }} label="inParams" id="editInParams"/>
                    <TextField inputRef={(input) => { this.editOutParams = input; }} label="outParams" id="editOutParams"/>
                    <Button raised={true} type="submit">Edit</Button>
                </form>
                <form onSubmit={(e)=>this.handleDelete(e)}>
                    <TextField inputRef={(input) => { this.deleteId = input; }} label="id" id="deleteId" required={true}/>
                    <Button raised={true} type="submit">Delete</Button>
                </form>

            </div>
        )
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
                {this.renderForms()}
                <Typography type="headline" align="center" gutterBottom>Actions</Typography>
                {this.renderActions()}
            </div>
        )
    }

}