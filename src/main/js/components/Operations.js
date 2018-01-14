import React, {Component} from "react";
import * as funcs from "../utils/requests";
import Operation from "./Operation";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    TextField,
    Typography
} from "material-ui";


export default class Operations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            code: "",
            description: "",
            actions: "",
            inParams: "",
            outParams: "",
            operations: {},
            createDialogOpened: false
        };
        this.closeDialog = this.closeDialog.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.clearState = this.clearState.bind(this);

    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        funcs.get("http://localhost:8080/api/operations", (response, status, statusText) => {
            let res = JSON.parse(response);
            console.log(res);
            if (status !== 200) {
                console.log(statusText);
            } else {
                this.setState({operations: res});
            }
        });
    }

    closeDialog() {
        this.setState({createDialogOpened: false});
    }

    openDialog() {
        this.setState({createDialogOpened: true});
    }

    renderCreationDialog() {
        return (
            <Dialog classes={{paper: "dialog"}} open={this.state.createDialogOpened}
                    onRequestClose={this.closeDialog}>
                <DialogTitle>
                    <Typography type="headline" gutterBottom>{"Создание операции"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root: "content"}}>
                    {this.renderCreationForm()}
                </DialogContent>
            </Dialog>
        );
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    renderCreationForm() {
        return (
            <div className={"dialog__content"}>
                <TextField onChange={this.handleChange("name")} label="name" required={true}/>
                <TextField onChange={this.handleChange("code")} label="code" required={true}/>
                <TextField onChange={this.handleChange("description")} label="description" required={true}/>
                <TextField onChange={this.handleChange("actions")} label="actions"/>
                <TextField onChange={this.handleChange("inParams")} label="inParams"/>
                <TextField onChange={this.handleChange("outParams")} label="outParams"/>
                <Button raised={true} onClick={() => {
                    this.closeDialog();
                    this.clearState();
                    this.createOperation();
                }}>{"Создать операцию"}</Button>
            </div>
        );
    }

    createOperation() {
        let name = this.state.name;
        let code = this.state.code;
        let description = this.state.description;
        let inParams = this.state.inParams;
        let outParams = this.state.outParams;
        let actions = this.state.actions;
        console.log(name + " " + code + " " + description + " " + actions + " " + inParams + " " + outParams);
        let url = "http://localhost:8080/api/operations/new?"
            + "name=" + name
            + "&code=" + code
            + "&description=" + description;
        if (actions) {
            url += "&actions=" + actions;
        }
        if (inParams) {
            url += "&inParams=" + inParams;
        }
        if (outParams) {
            url += "&outParams=" + outParams;
        }

        funcs.get(url, (response, status, statusText) => {
            console.log(response);
            console.log(statusText);
            this.loadData();
        });
    }

    renderOperations() {
        let params = this.state.operations;
        let operations = [];
        for (let i = 0; i < params.length; i++) {
            operations.push(<Operation key={i} data={params[i]}
                                       onDelete={this.openDeleteOperation}
                                       onEdit={this.openEditOperation}/>);
        }
        return operations;
    }

    renderDeleteConfirmOperation(){
        return (
            <Dialog open={this.state.showDeleteDialog}>
                <DialogTitle>
                    {"Удаление"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {"Удалить операцию?"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{
                        this.setState({showDeleteDialog:false});
                        this.handleDelete(this.state.targetId)}
                    } color="accent" raised>{"Удалить"}</Button>
                    <Button onClick={()=>this.setState({showDeleteDialog:false})} raised>{"Отмена"}</Button>
                </DialogActions>
            </Dialog>
        );
    }

    openDeleteOperation =(id)=>{
        this.setState({showDeleteDialog:true,targetId:id});
    }
    openEditOperation = (id) => {
        let operations = this.state.operations;
        let operation;
        for(let i=0;i < operations.length; i++){
            if(operations[i].id === id){
                operation = operations[i];
                break;
            }
        }
        if(!operation)
            return null;
        let inParams = "";
        if(operation.inParams){
            operation.inParams.map((item)=>{
                if(inParams === ""){
                    inParams=+item.id;
                } else {
                    inParams=+","+item.id;
                }
            });
        }

        let outParams ="";
        if(operation.outParams){
            operation.outParams.map((item)=>{
                if(outParams === ""){
                    outParams=+item.id;
                } else {
                    outParams=+","+item.id;
                }

            });
        }

        let actions ="";
        if(operation.actions){
            operation.actions.map((item)=>{
                if(actions === ""){
                    actions=+item.id;
                } else {
                    actions=+","+item.id;
                }

            });
        }
        this.setState({
            showEditDialog:true,
            targetId:id,
            name:operation.name,
            code:operation.code,
            description:operation.description,
            actions:actions,
            inParams:inParams,
            outParams:outParams});
    }

    handleDelete(id){
        let url = "http://localhost:8080/api/operations/delete?id="+id;
        funcs.get(url,(response, status, statusText)=>{
            console.log(response);
            console.log(statusText);
            this.loadData();
        });
    }

    closeEditDialog = ()=>{
        this.setState({showEditDialog:false});
    }

    renderEditionDialog(){
        return (
            <Dialog classes={{paper:"dialog"}} open={this.state.showEditDialog}
                    onRequestClose={this.closeEditDialog}>
                <DialogTitle>
                    <Typography type="headline" gutterBottom>{"Редактирование операции"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root:"content"}}>
                    {this.renderEditionForm()}
                </DialogContent>
            </Dialog>
        );
    }

    renderEditionForm(){

        return(
            <div className={"dialog__content"}>
                <TextField onChange={this.handleChange("name")}
                           value={this.state.name} label="name"/>
                <TextField onChange={this.handleChange("code")}
                           value={this.state.code} label="code"/>
                <TextField onChange={this.handleChange("description")}
                           value={this.state.description} label="description"/>
                <TextField onChange={this.handleChange("actions")} value={this.state.actions}
                           label="actions"/>
                <TextField onChange={this.handleChange("inParams")} value={this.state.inParams}
                           label="inParams"/>
                <TextField onChange={this.handleChange("outParams")} value={this.state.outParams}
                           label="outParams"/>
                <Button raised={true} type="submit" onClick={()=>{
                    this.closeEditDialog();
                    this.handleEditOperation(this.state.targetId)}
                }>РЕДАКТИРОВАТЬ</Button>
            </div>
        );
    }

    handleEditOperation(id){
        let name = this.state.name;
        let code = this.state.code;
        let description = this.state.description;
        let actions = this.state.actions;
        let inParams = this.state.inParams;
        let outParams = this.state.outParams;
        console.log(id+" "+name+" "+code+" "+actions+" "+description+" "+inParams+" "+outParams);
        let url = "http://localhost:8080/api/operations/edit?"
            +"id="+id;
        if(name){
            url+="&name="+name;
        }
        if(code){
            url+="&code="+code;
        }
        if(description){
            url+="&description="+description;
        }
        if(actions){
            url+="&actions="+actions;
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

    render() {

        return (
            <Paper>
                <div style={{"text-align": "center", "padding": "10px"}}>
                    <Button raised color="accent" onClick={this.openDialog}>
                        Создать операцию
                    </Button>
                </div>
                {this.renderDeleteConfirmOperation()}
                {this.renderEditionDialog()}
                {this.renderCreationDialog()}
                {this.renderOperations()}
            </Paper>
        );
    }

    clearState() {
        this.setState({
            name: "",
            code: "",
            description: "",
            module: "",
            actions: "",
            inParams: "",
            outParams: "",
        });
    }
}