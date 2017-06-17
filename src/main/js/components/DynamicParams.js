import React, { Component } from 'react'
import * as funcs from "../utils/requests";
import ReactDOM from 'react-dom'
import DynamicParam from "./DynamicParam";

export default class DynamicParams extends Component {
    constructor(props){
        super(props);
        this.state = {
            dynamicParams:{}
        }
    }
    componentDidMount() {
        this.loadData();
    }

    loadData(){
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

    handleCreateParam(e){
        e.preventDefault();

        let name = ReactDOM.findDOMNode(this.refs.newName).value;
        ReactDOM.findDOMNode(this.refs.newName).value = "";
        let code = ReactDOM.findDOMNode(this.refs.newCode).value;
        ReactDOM.findDOMNode(this.refs.newCode).value = "";
        let description = ReactDOM.findDOMNode(this.refs.newDescription).value;
        ReactDOM.findDOMNode(this.refs.newDescription).value = "";
        let required = ReactDOM.findDOMNode(this.refs.newRequired).checked;
        ReactDOM.findDOMNode(this.refs.newRequired).checked = false;
        let keepInWorkflow = ReactDOM.findDOMNode(this.refs.newKeepInWorkflow).checked;
        ReactDOM.findDOMNode(this.refs.newKeepInWorkflow).checked = false;
        console.log(name+" "+code+" "+description+" "+required+" "+keepInWorkflow);
        let url = "http://localhost:8080/api/dynamicParams/new?"
            +"name="+name
            +"&code="+code
            +"&description="+description
            +"&required="+required
            +"&keepInWorkflow="+keepInWorkflow;

        funcs.get(url,(response, status, statusText)=>{
            console.log(response);
            let res = JSON.parse(response);
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
        let description = ReactDOM.findDOMNode(this.refs.editDescription).value;
        ReactDOM.findDOMNode(this.refs.editDescription).value = "";
        let required = ReactDOM.findDOMNode(this.refs.editRequired).checked;
        ReactDOM.findDOMNode(this.refs.editRequired).checked = false;
        let keepInWorkflow = ReactDOM.findDOMNode(this.refs.editKeepInWorkflow).checked;
        ReactDOM.findDOMNode(this.refs.editKeepInWorkflow).checked = false;
        console.log(id+""+name+" "+code+" "+description+" "+required+" "+keepInWorkflow);
        let url = "http://localhost:8080/api/dynamicParams/edit?"
            +"id="+id
            +"&required="+required
            +"&keepInWorkflow="+keepInWorkflow;
        if(name){
            url+="&name="+name;
        }
        if(code){
            url+="&code="+code;
        }
        if(description){
            url+="&description="+description;
        }

        funcs.get(url,(response, status, statusText)=>{
            console.log(response);
            let res = JSON.parse(response);
            console.log(statusText);
            this.loadData();
        });

    }

    handleDelete(e){
        e.preventDefault();

        let id = ReactDOM.findDOMNode(this.refs.deleteId).value;
        ReactDOM.findDOMNode(this.refs.deleteId).value = "";
        console.log(id);
        let url = "http://localhost:8080/api/dynamicParams/delete?id="+id;
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
                    <input placeholder="description" ref="newDescription" required={true}/>
                    <lable><input type="checkbox" ref="newRequired"/>Required</lable>
                    <label><input type="checkbox" ref="newKeepInWorkflow"/>KeepInWorkflow</label>
                    <button type="submit">Create new</button>
                </form>
                <form onSubmit={(e)=>this.handleEditParam(e)}>
                    <input placeholder="id" ref="editId" required={true}/>
                    <input placeholder="name" ref="editName"/>
                    <input placeholder="code" ref="editCode"/>
                    <input placeholder="description" ref="editDescription"/>
                    <lable><input type="checkbox" ref="editRequired"/>Required</lable>
                    <label><input type="checkbox" ref="editKeepInWorkflow"/>KeepInWorkflow</label>
                    <button type="submit">Edit</button>
                </form>
                <form onSubmit={(e)=>this.handleDelete(e)}>
                    <input placeholder="id" ref="deleteId" required={true}/>
                    <button type="submit">Delete</button>
                </form>
            </div>
        )
    }

    renderHeader(params){
        let result = [];
        if(params.length > 0) {
            for (let key in params[0]) {
                if(params[0].hasOwnProperty(key)) {
                    result.push(<td key={key} className="cell">{key}</td>);
                }
            }
        }
        return (<tr className="bold">{result}</tr>);
    }


    renderParams(params){
        let result = [];
        for(let param in params){
            if(params.hasOwnProperty(param)){
                result.push(<DynamicParam key={param} data={params[param]}/>);//this.renderRow(params[param])
            }
        }
        return result;
    }

    renderRow(item){
        let result = [];
        for(let key in item){
            if(item.hasOwnProperty(key)){
                result.push(<td  className="cell">{""+item[key]}</td>);
            }
        }
        return(
            <tr>
                {result}
            </tr>
        );
    }

    render() {
        let params = this.state.dynamicParams;
        return (
            <div>
                {this.renderForms()}
                <h2>DynamicParams</h2>
                <table>
                    <thead>
                    {this.renderHeader(params)}
                    </thead>
                    <tbody>
                    {this.renderParams(params)}
                    </tbody>
                </table>
            </div>
        )
    }

}