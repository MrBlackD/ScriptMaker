import React, { Component } from 'react'
import * as funcs from "../utils/requests";
import DynamicParam from "./DynamicParam";

import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Switch,
    Table, TableBody,
    TableCell,
    TableHead, TableRow,
    TextField,
    Typography
} from "material-ui";


export default class DynamicParams extends Component {
    constructor(props){
        super(props);
        this.state = {
            targetId:0,
            openDialog:false,
            deleteConfirmDialogOpened:false,
            editionDialogOpened:false,
            dynamicParams:{}
        };

        this.handleRequestCloseDialog = this.handleRequestCloseDialog.bind(this);
        this.handleRequestEditDialog = this.handleRequestEditDialog.bind(this);
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

    handleCreateParam(){
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

    handleEditParam(id){
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

    handleDelete(id){
        let url = "http://localhost:8080/api/dynamicParams/delete?id="+id;
        funcs.get(url,(response, status, statusText)=>{
            console.log(response);
            console.log(statusText);
            this.loadData();
        });
    }

    handleRequestCloseDialog(){
        this.setState({openDialog:false});
    }

    handleRequestEditDialog(){
        this.setState({editionDialogOpened:false});
    }

    renderHeader(params){
        let result = [];
        if(params.length > 0) {
            for (let key in params[0]) {
                if(params[0].hasOwnProperty(key)) {
                    result.push(<TableCell key={key}>{key}</TableCell>);
                }
            }
            result.push(<TableCell key={params.length}>{"Edit"}</TableCell>);
            result.push(<TableCell key={params.length + 1}>{"Delete"}</TableCell>);
        }
        return (<TableRow>{result}</TableRow>);
    }

    openDeleteDialog(id){
        this.setState({deleteConfirmDialogOpened:true,targetId:id});
    }

    openEditDialog(id){
        this.setState({editionDialogOpened:true,targetId:id});
    }


    renderParams(params){
        let result = [];
        for(let param in params){
            if(params.hasOwnProperty(param)){
                result.push(<DynamicParam onClose={(id)=>this.openDeleteDialog(id)} onEdit={(id)=>this.openEditDialog(id)} key={param} data={params[param]}/>);
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

    renderCreationDialog(){
        return (
            <Dialog classes={{paper:"dialog"}} open={this.state.openDialog} onRequestClose={this.handleRequestCloseDialog}>
                <DialogTitle>
                    <Typography type="headline" gutterBottom>{"Создание динамического параметра"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root:"content"}}>
                    {this.renderCreationForm()}
                </DialogContent>
            </Dialog>
        );
    }

    renderEditionDialog(){
        return (
            <Dialog classes={{paper:"dialog"}} open={this.state.editionDialogOpened} onRequestClose={this.handleRequestEditDialog}>
                <DialogTitle>
                    <Typography type="headline" gutterBottom>{"Редактирование динамического параметра"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root:"content"}}>
                    {this.renderEditionForm()}
                </DialogContent>
            </Dialog>
        );
    }

    renderDeleteConfirmDialog(){
        return (
            <Dialog open={this.state.deleteConfirmDialogOpened}>
                <DialogTitle>
                    {"Удаление"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {"Удалить динамический параметр?"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{
                        this.setState({deleteConfirmDialogOpened:false});
                        this.handleDelete(this.state.targetId)}
                    } color="accent" raised>{"Удалить"}</Button>
                    <Button onClick={()=>this.setState({deleteConfirmDialogOpened:false})} raised>{"Отмена"}</Button>
                </DialogActions>
            </Dialog>
        );
    }

    renderCreationForm(){
        return(
            <div className={"dialog__content"}>
                <TextField id="newName"  inputRef={(input) => { this.newName = input; }} label="Name" required={true}/>
                <TextField id="newCode"  inputRef={(input) => { this.newCode = input; }} label="Code" required={true}/>
                <TextField id="newDescription"  inputRef={(input) => { this.newDescription = input; }} label="Description" required={true}/>
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
                <Button color="accent"  raised={true} onClick={()=>{this.handleRequestCloseDialog();this.handleCreateParam()}}>Create new</Button>
            </div>
        );
    }

    renderEditionForm(){
        let params = this.state.dynamicParams;
        let param;
        for(let i=0;i < params.length; i++){
            if(params[i].id === this.state.targetId){
                param = params[i];
                break;
            }
        }
        if(!param)
            return null;
        return(
            <div className={"dialog__content"}>
                <TextField id="editName" inputRef={(input) => { this.editName = input; }} defaultValue={param.name} label="Name"/>
                <TextField id="editCode" inputRef={(input) => { this.editCode = input; }} defaultValue={param.code} label="Code"/>
                <TextField id="editDescription" inputRef={(input) => { this.editDescription = input; }} defaultValue={param.description} label="Description"/>
                <FormControlLabel inputRef={(input) => { this.editRequired = input; }}
                                  control={
                                      <Switch checked={param.required} id="editRequired" />
                                  }
                                  label="Required"
                />
                <FormControlLabel inputRef={(input) => { this.editKeepInWorkflow = input; }}
                                  control={
                                      <Switch checked={param.keepInWorkflow} id="editKeepInWorkflow" />
                                  }
                                  label="KeepInWorkflow"
                />
                <Button color="accent"  raised={true} onClick={()=>{this.handleRequestEditDialog();this.handleEditParam(this.state.targetId)}}>Редактировать</Button>
            </div>
        );
    }

    render() {
        let params = this.state.dynamicParams;
        return (
            <div>
                <div style={{"text-align":"center","padding":"10px"}}>
                    <Button onClick={()=>{
                        this.setState({openDialog:true});
                    }} raised color="accent">Создать динамический параметр</Button>
                </div>
                {this.renderCreationDialog()}
                {this.renderEditionDialog()}
                {this.renderDeleteConfirmDialog()}
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