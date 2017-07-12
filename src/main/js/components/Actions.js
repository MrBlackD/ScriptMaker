import React, { Component } from 'react'
import * as funcs from "../utils/requests";
import ReactDOM from 'react-dom'
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

    handleCreateParam(e){
        e.preventDefault();

        let name = ReactDOM.findDOMNode(this.refs.newName).value;
        ReactDOM.findDOMNode(this.refs.newName).value = "";
        let code = ReactDOM.findDOMNode(this.refs.newCode).value;
        ReactDOM.findDOMNode(this.refs.newCode).value = "";
        let module = ReactDOM.findDOMNode(this.refs.newModule).value;
        ReactDOM.findDOMNode(this.refs.newModule).value = "";
        let description = ReactDOM.findDOMNode(this.refs.newDescription).value;
        ReactDOM.findDOMNode(this.refs.newDescription).value = "";
        let inParams = ReactDOM.findDOMNode(this.refs.newInParams).value;
        ReactDOM.findDOMNode(this.refs.newInParams).value = "";
        let outParams = ReactDOM.findDOMNode(this.refs.newOutParams).value;
        ReactDOM.findDOMNode(this.refs.newOutParams).value = "";
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

        let id = ReactDOM.findDOMNode(this.refs.editId).value;
        ReactDOM.findDOMNode(this.refs.editId).value = "";
        let name = ReactDOM.findDOMNode(this.refs.editName).value;
        ReactDOM.findDOMNode(this.refs.editName).value = "";
        let code = ReactDOM.findDOMNode(this.refs.editCode).value;
        ReactDOM.findDOMNode(this.refs.editCode).value = "";
        let module = ReactDOM.findDOMNode(this.refs.editModule).value;
        ReactDOM.findDOMNode(this.refs.editModule).value = "";
        let description = ReactDOM.findDOMNode(this.refs.editDescription).value;
        ReactDOM.findDOMNode(this.refs.editDescription).value = "";
        let inParams = ReactDOM.findDOMNode(this.refs.editInParams).value;
        ReactDOM.findDOMNode(this.refs.editInParams).value = "";
        let outParams = ReactDOM.findDOMNode(this.refs.editOutParams).value;
        ReactDOM.findDOMNode(this.refs.editOutParams).value = "";
        console.log(id+""+name+" "+code+" "+module+" "+description+" "+inParams+" "+outParams);
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

        let id = ReactDOM.findDOMNode(this.refs.deleteId).value;
        ReactDOM.findDOMNode(this.refs.deleteId).value = "";
        console.log(id);
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
                    <input placeholder="name" ref="newName" required={true}/>
                    <input placeholder="code" ref="newCode" required={true}/>
                    <input placeholder="module" ref="newModule" required={true}/>
                    <input placeholder="description" ref="newDescription" required={true}/>
                    <input placeholder="inParams" ref="newInParams" />
                    <input placeholder="outParams" ref="newOutParams" />
                    <button type="submit">Create new</button>
                </form>
                <form onSubmit={(e)=>this.handleEditParam(e)}>
                    <input placeholder="id" ref="editId" required={true}/>
                    <input placeholder="name" ref="editName"/>
                    <input placeholder="code" ref="editCode"/>
                    <input placeholder="module" ref="editModule"/>
                    <input placeholder="description" ref="editDescription"/>
                    <input placeholder="inParams" ref="editInParams"/>
                    <input placeholder="outParams" ref="editOutParams"/>
                    <button type="submit">Edit</button>
                </form>
                <form onSubmit={(e)=>this.handleDelete(e)}>
                    <input placeholder="id" ref="deleteId" required={true}/>
                    <button type="submit">Delete</button>
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
                <h2>Actions</h2>
                {this.renderActions()}
            </div>
        )
    }

}