import React, { Component } from 'react'
import * as funcs from "../utils/requests";
import DynamicParam from "./DynamicParam";

import {
    Button, Divider, FormControlLabel, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField,
    Typography
} from "material-ui";


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
        let name = this.newName.value;
        this.newName.value = "";
        let code = this.newCode.value;
        this.newCode.value = "";
        let description = this.newDescription.value;
        this.newDescription.value = "";
        let required = this.newRequired.checked;
        this.newRequired.checked = false;//не работает
        let keepInWorkflow = this.newKeepInWorkflow.checked;
        this.newKeepInWorkflow.checked = false;// не работает
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

        let id = this.editId.value;
        this.editId.value = "";
        let name = this.editName.value;
        this.editName.value = "";
        let code = this.editCode.value;
        this.editCode.value = "";
        let description = this.editDescription.value;
        this.editDescription.value = "";
        let required = this.editRequired.checked;
        let keepInWorkflow = this.editKeepInWorkflow.checked;
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
        let id = this.deleteId.value;
        this.deleteId.value = "";
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
                    <TextField id="newName" inputRef={(input) => { this.newName = input; }} label="Name" required={true}/>
                    <TextField id="newCode" inputRef={(input) => { this.newCode = input; }} label="Code" required={true}/>
                    <TextField id="newDescription" inputRef={(input) => { this.newDescription = input; }} label="Description" required={true}/>
                    <FormControlLabel inputRef={(input) => {this.newRequired = input}}
                        control={
                            <Switch id="newRequired"/>
                        }
                        label="Required"
                    />
                    <FormControlLabel inputRef={(input) => {this.newKeepInWorkflow = input}}
                        control={
                            <Switch id="newKeepInWorkflow"  />
                        }
                        label="KeepInWorkflow"
                    />
                    <Button color="accent"  raised={true} type="submit">Create new</Button>
                </form>
                <form onSubmit={(e)=>this.handleEditParam(e)}>
                    <TextField id="editId" inputRef={(input) => { this.editId = input; }} label="Id" required={true}/>
                    <TextField id="editName" inputRef={(input) => { this.editName = input; }} label="Name"/>
                    <TextField id="editCode" inputRef={(input) => { this.editCode = input; }} label="Code"/>
                    <TextField id="editDescription" inputRef={(input) => { this.editDescription = input; }} label="Description"/>
                    <FormControlLabel inputRef={(input) => { this.editRequired = input; }}
                        control={
                            <Switch id="editRequired" />
                        }
                        label="Required"
                    />
                    <FormControlLabel inputRef={(input) => { this.editKeepInWorkflow = input; }}
                        control={
                            <Switch id="editKeepInWorkflow" />
                        }
                        label="KeepInWorkflow"
                    />
                    <Button color="accent"  raised={true} type="submit">Edit</Button>
                </form>
                <form onSubmit={(e)=>this.handleDelete(e)}>
                    <TextField id="deleteId" label="Id" inputRef={(input) => { this.deleteId = input; }} required={true}/>
                    <Button color="accent" raised={true} type="submit" >Delete</Button>
                </form>
            </div>
        )
    }

    renderHeader(params){
        let result = [];
        if(params.length > 0) {
            for (let key in params[0]) {
                if(params[0].hasOwnProperty(key)) {
                    result.push(<TableCell key={key}>{key}</TableCell>);
                }
            }
        }
        return (<TableRow>{result}</TableRow>);
    }


    renderParams(params){
        let result = [];
        for(let param in params){
            if(params.hasOwnProperty(param)){
                result.push(<DynamicParam key={param} data={params[param]}/>);
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
                <Divider />
                <Typography type="headline" align="center" gutterBottom>DynamicParams</Typography>
                <Table>
                    <TableHead>
                        {this.renderHeader(params)}
                    </TableHead>
                    <TableBody>
                        {this.renderParams(params)}
                    </TableBody>
                </Table>
            </div>
        )
    }

}