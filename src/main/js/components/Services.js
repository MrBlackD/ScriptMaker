import React, {Component} from "react";
import * as funcs from "../utils/requests";
import Service from "./Service";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Input,
    InputLabel,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from "material-ui";


export default class Services extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            code: "",
            description: "",
            inParams: "",
            outParams: "",
            operations: {},
            services:{},
            createDialogOpened: false,
            dynamicParams:[],
            operationsRegistry:[]
        };
        this.closeDialog = this.closeDialog.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.clearState = this.clearState.bind(this);

    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        funcs.get("http://localhost:8080/api/dynamicParams", (response, status, statusText) => {
            let res = JSON.parse(response);
            console.log(res);
            if (status !== 200) {
                console.log(statusText);
            } else {
                this.setState({dynamicParams: res});
            }
        });
        funcs.get("http://localhost:8080/api/operations", (response, status, statusText) => {
            let res = JSON.parse(response);
            console.log(res);
            if (status !== 200) {
                console.log(statusText);
            } else {
                this.setState({operationsRegistry: res});
            }
        });
        funcs.get("http://localhost:8080/api/services", (response, status, statusText) => {
            let res = JSON.parse(response);
            console.log(res);
            if (status !== 200) {
                console.log(statusText);
            } else {
                this.setState({services: res});
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
                    onClose={this.closeDialog}>
                <DialogTitle>
                    <Typography type="headline" gutterBottom>{"Создание сервиса"}</Typography>
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
                <InputLabel htmlFor="operations">Operations</InputLabel>
                <Select multiple value={[...this.state.operations]}
                        renderValue={selected => selected.join(', ')}
                        onChange={(e)=>{this.setState({operations:e.target.value})}}
                        input={<Input id="operations"/>}>
                    {this.state.operationsRegistry.map(param => (
                        <MenuItem key={param.id} value={param.code}>
                            <Checkbox checked={Object.values(this.state.operations).includes(param.code)} />
                            <ListItemText primary={param.code} />
                        </MenuItem>
                    ))}
                </Select>
                <InputLabel htmlFor="inParams">inParams</InputLabel>
                <Select multiple value={[...this.state.inParams]}
                        renderValue={selected => selected.join(', ')}
                        onChange={(e)=>{this.setState({inParams:e.target.value})}}
                        input={<Input id="inParams" />}>
                    {this.state.dynamicParams.map(param => (
                        <MenuItem key={param.id} value={param.code}>
                            <Checkbox checked={Object.values(this.state.inParams).includes(param.code)} />
                            <ListItemText primary={param.code} />
                        </MenuItem>
                    ))}
                </Select>
                <InputLabel htmlFor="outParams">outParams</InputLabel>
                <Select multiple value={[...this.state.outParams]}
                        renderValue={selected => selected.join(', ')}
                        onChange={(e)=>{this.setState({outParams:e.target.value})}}
                        input={<Input id="inParams" />}>
                    {this.state.dynamicParams.map(param => (
                        <MenuItem key={param.id} value={param.code}>
                            <Checkbox checked={Object.values(this.state.outParams).includes(param.code)} />
                            <ListItemText primary={param.code} />
                        </MenuItem>
                    ))}
                </Select>
                <Button raised={true} onClick={() => {
                    this.closeDialog();
                    this.clearState();
                    this.createService();
                }}>{"Создать сервис"}</Button>
            </div>
        );
    }

    createService() {
        let name = this.state.name;
        let code = this.state.code;
        let description = this.state.description;
        let inParams = "";
        if(this.state.inParams) {
            this.state.dynamicParams.forEach((param) => {
                this.state.inParams.forEach((inParamCode) => {
                    if (param.code === inParamCode) {
                        inParams += param.id + ",";
                    }
                })

            })
        }

        let outParams = "";
        if(this.state.outParams) {
            this.state.dynamicParams.forEach((param) => {
                this.state.outParams.forEach((outParamCode) => {
                    if (param.code === outParamCode) {
                        outParams += param.id + ",";
                    }
                })
            })
        }
        let operations = "";
        if(this.state.operations) {
            this.state.operationsRegistry.forEach((operation) => {
                this.state.operations.forEach((operationCode) => {
                    if (operation.code === operationCode) {
                        operations += operation.id + ",";
                    }
                })

            })
        }
        console.log(name + " " + code + " " + description + " " + operations + " " + inParams + " " + outParams);
        let url = "http://localhost:8080/api/services/new?"
            + "name=" + name
            + "&code=" + code
            + "&description=" + description;
        if (operations) {
            url += "&operations=" + operations;
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

    renderServices() {
        let params = this.state.services;
        let services = [];
        for (let i = 0; i < params.length; i++) {
            services.push(<Service key={i} data={params[i]}
                                       onDelete={this.openDeleteService}
                                       onEdit={this.openEditService}/>);
        }
        return services;
    }

    renderDeleteConfirmService(){
        return (
            <Dialog open={this.state.showDeleteDialog}>
                <DialogTitle>
                    {"Удаление"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {"Удалить сервис?"}
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

    openDeleteService =(id)=>{
        this.setState({showDeleteDialog:true,targetId:id});
    }
    openEditService = (id) => {
        let services = this.state.services;
        let service;
        for(let i=0;i < services.length; i++){
            if(services[i].id === id){
                service = services[i];
                break;
            }
        }
        if(!service)
            return null;
        let inParams = [];
        if (service.inParams) {
            service.inParams.map((item) => {
                inParams.push(item.code)
            });
        }

        let outParams = [];
        if (service.outParams) {
            service.outParams.map((item) => {
                outParams.push(item.code)
            });
        }

        let operations =[];
        if (service.operations) {
            service.operations.map((item) => {
                operations.push(item.code)
            });
        }
        this.setState({
            showEditDialog:true,
            targetId:id,
            name:service.name,
            code:service.code,
            description:service.description,
            operations:operations,
            inParams:inParams,
            outParams:outParams});
    }

    handleDelete(id){
        let url = "http://localhost:8080/api/services/delete?id="+id;
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
                    onClose={this.closeEditDialog}>
                <DialogTitle>
                    <Typography type="headline" gutterBottom>{"Редактирование сервиса"}</Typography>
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
                <InputLabel htmlFor="operations">Operations</InputLabel>
                <Select multiple value={[...this.state.operations]}
                        renderValue={selected => selected.join(', ')}
                        onChange={(e)=>{this.setState({operations:e.target.value})}}
                        input={<Input id="operations"/>}>
                    {this.state.operationsRegistry.map(param => (
                        <MenuItem key={param.id} value={param.code}>
                            <Checkbox checked={Object.values(this.state.operations).includes(param.code)} />
                            <ListItemText primary={param.code} />
                        </MenuItem>
                    ))}
                </Select>
                <InputLabel htmlFor="inParams">inParams</InputLabel>
                <Select multiple value={[...this.state.inParams]}
                        renderValue={selected => selected.join(', ')}
                        onChange={(e)=>{this.setState({inParams:e.target.value})}}
                        input={<Input id="inParams"/>}>
                    {this.state.dynamicParams.map(param => (
                        <MenuItem key={param.id} value={param.code}>
                            <Checkbox checked={Object.values(this.state.inParams).includes(param.code)} />
                            <ListItemText primary={param.code} />
                        </MenuItem>
                    ))}
                </Select>
                <InputLabel htmlFor="outParams">outParams</InputLabel>
                <Select multiple value={[...this.state.outParams]}
                        renderValue={selected => selected.join(', ')}
                        onChange={(e)=>{this.setState({outParams:e.target.value})}}
                        input={<Input id="outParams"/>}>
                    {this.state.dynamicParams.map(param => (
                        <MenuItem key={param.id} value={param.code}>
                            <Checkbox checked={Object.values(this.state.outParams).includes(param.code)} />
                            <ListItemText primary={param.code} />
                        </MenuItem>
                    ))}
                </Select>
                <Button raised={true} type="submit" onClick={()=>{
                    this.closeEditDialog();
                    this.handleEditService(this.state.targetId)}
                }>РЕДАКТИРОВАТЬ</Button>
            </div>
        );
    }

    handleEditService(id){
        let name = this.state.name;
        let code = this.state.code;
        let description = this.state.description;
        let inParams = "";
        if(this.state.inParams) {
            this.state.dynamicParams.forEach((param) => {
                this.state.inParams.forEach((inParamCode) => {
                    if (param.code === inParamCode) {
                        inParams += param.id + ",";
                    }
                })

            })
        }

        let outParams = "";
        if(this.state.outParams) {
            this.state.dynamicParams.forEach((param) => {
                this.state.outParams.forEach((outParamCode) => {
                    if (param.code === outParamCode) {
                        outParams += param.id + ",";
                    }
                })
            })
        }
        let operations = "";
        if(this.state.operations) {
            this.state.operationsRegistry.forEach((operation) => {
                this.state.operations.forEach((operationCode) => {
                    if (operation.code === operationCode) {
                        operations += operation.id + ",";
                    }
                })

            })
        }
        console.log(id+" "+name+" "+code+" "+operations+" "+description+" "+inParams+" "+outParams);
        let url = "http://localhost:8080/api/services/edit?"
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
        if(operations){
            url+="&operations="+operations;
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
                        Создать сервис
                    </Button>
                </div>
                {this.renderDeleteConfirmService()}
                {this.renderEditionDialog()}
                {this.renderCreationDialog()}
                {this.renderServices()}
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