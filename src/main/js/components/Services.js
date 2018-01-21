import React, {Component} from "react";
import * as funcs from "../utils/requests";
import Service from "./Service";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    InputLabel,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "material-ui";
import Autosuggest from "react-autosuggest";
import {Add, Remove} from "material-ui-icons";


export default class Services extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            code: "",
            description: "",
            targetId:0,
            target:{},
            inParams: [],
            outParams: [],
            operations: [],
            services:[],
            createDialogOpened: false,
            dynamicParams:[],
            operationsRegistry:[],
            value:"",
            suggestions: [],
            newParamId: "",
            newParamRequired: false,
            newParamKeepInWorkflow: false,
            newParamDefaultValue: "",
            newParamType: ""
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

    getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : this.state.operationsRegistry.filter(action =>
            action.code.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    getSuggestionValue = suggestion => suggestion.code;
    renderSuggestion = suggestion => (
        <span>
            {suggestion.code}
        </span>
    );


    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    renderOperationsInputs = () => {
        const {suggestions} = this.state;

        return this.state.operations.map((operation, index) => {
            const value = this.state.operations[index] || "";
            const inputProps = {
                placeholder: 'Type an operation code',
                value:value,
                onChange: (event,{newValue}) => {
                    let operations = [...this.state.operations];
                    operations[index] = newValue;
                    this.setState({operations});
                }
            };
            return <div key={index}>
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                />
                <Remove onClick={() => {
                    let operations = [...this.state.operations];
                    operations.splice(index, 1);
                    this.setState({operations});
                }}/>
            </div>
        });

    }

    renderCreationForm() {
        return (
            <div className={"dialog__content"}>
                <TextField onChange={this.handleChange("name")} label="name" required={true}/>
                <TextField onChange={this.handleChange("code")} label="code" required={true}/>
                <TextField onChange={this.handleChange("description")} label="description" required={true}/>
                <InputLabel>Operations</InputLabel>
                {this.renderOperationsInputs()}
                <Add onClick={() => {
                    let operations = [...this.state.operations];
                    operations.push("");
                    this.setState({operations});
                }}/>
                {this.renderInParams()}
                {this.renderOutParams()}
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
        let inParams = this.state.inParams.join("");
        let outParams = this.state.outParams.join("");
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
    openEditService = (service) => {
        let inParams = [];
        service.inParams.forEach(({dynamicParam, required, keepInWorkflow, defaultValue}) => {
            inParams.push(dynamicParam.id + ","
                + required + ","
                + keepInWorkflow + ","
                + defaultValue + ";");
        });
        let outParams = [];
        service.outParams.forEach(({dynamicParam, required, keepInWorkflow, defaultValue}) => {
            outParams.push(dynamicParam.id + ","
                + required + ","
                + keepInWorkflow + ","
                + defaultValue + ";");
        });

        let operations =[];
        if (service.operations) {
            service.operations.map((item) => {
                operations.push(item.code)
            });
        }
        this.setState({
            showEditDialog:true,
            target:service,
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
                <InputLabel>Operations</InputLabel>
                {this.renderOperationsInputs()}
                <Add onClick={() => {
                    let operations = [...this.state.operations];
                    operations.push("");
                    this.setState({operations});
                }}/>
                {this.renderInParams()}
                {this.renderOutParams()}
                <Button raised={true} type="submit" onClick={()=>{
                    this.closeEditDialog();
                    this.handleEditService(this.state.target)}
                } color="accent">РЕДАКТИРОВАТЬ</Button>
            </div>
        );
    }

    handleEditService(operation){
        let name = this.state.name;
        let code = this.state.code;
        let description = this.state.description;
        let inParams = this.state.inParams.join("");
        let outParams = this.state.outParams.join("");
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
        console.log(operation.id+" "+name+" "+code+" "+operations+" "+description+" "+inParams+" "+outParams);
        let url = "http://localhost:8080/api/services/edit?"
            +"id="+operation.id;
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
                {this.renderAddParamDialog()}
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
            inParams: [],
            outParams: [],
        });
    }

    renderInParams() {
        return (
            <div>
                <Typography type="subheading" gutterBottom>{"Входящие параметры"}</Typography>
                {this.renderTableParams("inParams")}
                <Button raised={true} onClick={() => {
                    this.setState({openedAddParamDialog: true, newParamType: "inParams"});
                }}>Добавить входящий параметр</Button>
            </div>
        );
    }

    renderOutParams() {
        return(
            <div>
                <Typography type="subheading" gutterBottom>{"Исходящие параметры"}</Typography>
                {this.renderTableParams("outParams")}
                <Button raised={true} onClick={() => {
                    this.setState({openedAddParamDialog: true, newParamType: "outParams"});
                }}>Добавить исходящий параметр</Button>
            </div>
        );
    }

    renderTableParams(params) {
        return(
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>paramId</TableCell>
                        <TableCell>defaultValue</TableCell>
                        <TableCell>required</TableCell>
                        <TableCell>keepInWorkflow</TableCell>
                        <TableCell>Remove</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        this.state[params].map((param) => {
                            const splittedParam = param.slice(0,param.length-1).split(",");
                            return <TableRow>
                                <TableCell>{splittedParam[0]}</TableCell>
                                <TableCell>{splittedParam[3]}</TableCell>
                                <TableCell>{splittedParam[1]}</TableCell>
                                <TableCell>{splittedParam[2]}</TableCell>
                                <TableCell>
                                    <Remove onClick={() => {
                                        let resultParams = [...this.state[params]];
                                        resultParams.splice(resultParams.indexOf(param), 1);
                                        const state = {...this.state};
                                        state[params] = resultParams;
                                        this.setState(state);
                                    }}/>
                                </TableCell>
                            </TableRow>;
                        })
                    }
                </TableBody>
            </Table>
        );
    }

    renderAddParamDialog() {
        return (
            <Dialog classes={{paper: "dialog"}} open={this.state.openedAddParamDialog}
                    onClose={() => {
                        this.setState({openedAddParamDialog: false})
                    }}>
                <DialogTitle>
                    <Typography type="headline" gutterBottom>{"Динамический параметр"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root: "content"}}>
                    <TextField value={this.state.newParamId}
                               onChange={(e) => this.setState({newParamId: e.target.value})}
                               label="paramId"/>
                    <TextField value={this.state.newParamDefaultValue}
                               onChange={(e) => {
                                   this.setState({newParamDefaultValue: e.target.value})
                               }}
                               label="defaultValue"/>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.state.newParamRequired}
                                onChange={(event, checked) => {
                                    this.setState({newParamRequired: checked})
                                }}
                            />
                        }
                        label="Required"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.state.newParamKeepInWorkflow}
                                onChange={(event, checked) => {
                                    this.setState({newParamKeepInWorkflow: checked})
                                }}
                            />
                        }
                        label="KeepInWorkflow"
                    />
                    <Button raised={true} onClick={() => {
                        let params = this.state[this.state.newParamType].slice();
                        const {
                            newParamId,
                            newParamRequired,
                            newParamKeepInWorkflow,
                            newParamDefaultValue
                        } = this.state;
                        const newParam = newParamId + ","
                            + newParamRequired + ","
                            + newParamKeepInWorkflow + ","
                            + newParamDefaultValue + ";";
                        params.push(newParam);
                        const state = {...this.state};
                        state[this.state.newParamType] = params;
                        state.openedAddParamDialog = false;
                        state.newParamId = "";
                        state.newParamRequired = false;
                        state.newParamKeepInWorkflow = false;
                        state.newParamDefaultValue = "";
                        this.setState(state)
                    }}>Добавить параметр</Button>
                </DialogContent>
            </Dialog>
        );
    }
}