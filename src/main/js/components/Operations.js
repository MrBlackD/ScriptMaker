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
    FormControlLabel,
    Input,
    MenuItem,
    Paper,
    Select,
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
import {Remove} from "material-ui-icons";
import Suggest from "./Suggest";


export default class Operations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            targetId:0,
            target:{},
            code: "",
            description: "",
            actions: [],
            inParams: [],
            outParams: [],
            operations: {},
            createDialogOpened: false,
            dynamicParams: [],
            actionsRegistry: [],
            value: "",
            suggestions: [],
            openAddActionDialog: false,
            newActionId: "",
            newMapping:[],
            newParamCode: "",
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
        funcs.get("http://localhost:8080/api/actions", (response, status, statusText) => {
            let res = JSON.parse(response);
            console.log(res);
            if (status !== 200) {
                console.log(statusText);
            } else {
                this.setState({actionsRegistry: res});
            }
        });
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
                    onClose={this.closeDialog}>
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

    renderActionsInputs = () => {
        console.log(this.state.actions);
        const {suggestions} = this.state;

        return this.state.actions.map((action, index) => {
            const value = this.state.actions[index] || "";
            const inputProps = {
                placeholder: 'Type an action code',
                value: value,
                onChange: (event, {newValue}) => {
                    let actions = [...this.state.actions];
                    actions[index] = newValue;
                    this.setState({actions});
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
                    let actions = [...this.state.actions];
                    actions.splice(index, 1);
                    console.log(index);
                    this.setState({actions});
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
                {this.renderOperationActions()}
                {this.renderInParams()}
                {this.renderOutParams()}
                <Button raised={true} onClick={() => {
                    this.closeDialog();
                    this.createOperation();
                }} color="accent">{"Создать операцию"}</Button>
            </div>
        );
    }

    createOperation() {
        let name = this.state.name;
        let code = this.state.code;
        let description = this.state.description;
        let inParams = this.state.inParams.join("");
        let outParams = this.state.outParams.join("");
        let actions = this.state.actions.join("!");
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
        this.clearState();
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

    renderDeleteConfirmOperation() {
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
                    <Button onClick={() => {
                        this.setState({showDeleteDialog: false});
                        this.handleDelete(this.state.targetId)
                    }
                    } color="accent" raised>{"Удалить"}</Button>
                    <Button onClick={() => this.setState({showDeleteDialog: false})} raised>{"Отмена"}</Button>
                </DialogActions>
            </Dialog>
        );
    }

    openDeleteOperation = (id) => {
        this.setState({showDeleteDialog: true, targetId: id});
    }
    openEditOperation = (operation) => {

        let inParams = [];
        operation.inParams.forEach(({dynamicParam, required, keepInWorkflow, defaultValue}) => {
            inParams.push(dynamicParam.id + ","
                + required + ","
                + keepInWorkflow + ","
                + defaultValue + ";");
        });
        let outParams = [];
        operation.outParams.forEach(({dynamicParam, required, keepInWorkflow, defaultValue}) => {
            outParams.push(dynamicParam.id + ","
                + required + ","
                + keepInWorkflow + ","
                + defaultValue + ";");
        });

        let actions = [];
        if (operation.actions) {
            operation.actions.map((actionInstance) => {
                let actionMapping = "";
                actionInstance.mapping.forEach((mapping)=>{
                    actionMapping += mapping.in +","+mapping.out + "," + mapping.type + ";";
                });
                actions.push(actionInstance.action.id+":"+actionMapping)
            });
        }
        this.setState({
            showEditDialog: true,
            target: operation,
            name: operation.name,
            code: operation.code,
            description: operation.description,
            actions: actions,
            inParams: inParams,
            outParams: outParams
        });
    }

    handleDelete(id) {
        let url = "http://localhost:8080/api/operations/delete?id=" + id;
        funcs.get(url, (response, status, statusText) => {
            console.log(response);
            console.log(statusText);
            this.loadData();
        });
    }

    closeEditDialog = () => {
        this.setState({showEditDialog: false});
    }

    renderEditionDialog() {
        return (
            <Dialog classes={{paper: "dialog"}} open={this.state.showEditDialog}
                    onClose={this.closeEditDialog}>
                <DialogTitle>
                    <Typography type="headline" gutterBottom>{"Редактирование операции"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root: "content"}}>
                    {this.renderEditionForm()}
                </DialogContent>
            </Dialog>
        );
    }

    renderAddActionDialog() {
        return (
            <Dialog classes={{paper: "dialog"}} open={this.state.openAddActionDialog}
                    onClose={() => {
                        this.setState({openAddActionDialog: false})
                    }}>
                <DialogTitle>
                    <Typography type="headline" gutterBottom>{"Добавление действия"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root: "content"}}>
                    <TextField value={this.state.newActionId}
                               onChange={(e) => this.setState({newActionId: e.target.value})}
                               label="actionId"/>
                    {this.state.newMapping.map((mapping,index)=>{

                        return <div>
                            <TextField value={mapping.in}
                                       onChange={(e) => {
                                           const newMapping = this.state.newMapping;
                                           newMapping[index].in = e.target.value;
                                           this.setState({newMapping: newMapping})
                                       }}
                                       label="in"/>
                            <TextField value={mapping.out}
                                       onChange={(e) => {
                                           const newMapping = this.state.newMapping;
                                           newMapping[index].out = e.target.value;
                                           this.setState({newMapping: newMapping})
                                       }}
                                       label="out"/>
                                <Select
                                value={mapping.type}
                                onChange={(e) => {
                                    const newMapping = this.state.newMapping;
                                    newMapping[index].type = e.target.value;
                                    this.setState({newMapping: newMapping})
                                }}
                                input={<Input name="type" id="type" />}
                                >
                                <MenuItem value="IN">IN</MenuItem>
                                <MenuItem value="OUT">OUT</MenuItem>
                            </Select>
                            {/*<TextField value={mapping.type}*/}
                                       {/*onChange={(e) => {*/}
                                           {/*const newMapping = this.state.newMapping;*/}
                                           {/*newMapping[index].type = e.target.value;*/}
                                           {/*this.setState({newMapping: newMapping})*/}
                                       {/*}}*/}
                                       {/*label="type"/>*/}
                            <Remove onClick={() => {
                                let resultMapping = [...this.state.newMapping];
                                resultMapping.splice(index, 1);
                                this.setState({newMapping:resultMapping});
                            }}/>
                        </div>
                    })}
                    <div>

                        <Button raised={true} type="submit" onClick={() => {
                            const mapping = this.state.newMapping.slice();
                            mapping.push({
                                in:"",
                                out:"",
                                type:"IN"
                            })
                            this.setState({newMapping:mapping});
                        }}>Добавить маппинг</Button>
                    </div>
                    <div>
                        <Button raised={true} type="submit" onClick={() => {
                            const actions = this.state.actions.slice();
                            let newMapping = "";
                            this.state.newMapping.forEach((mapping)=>{
                                newMapping += mapping.in +","+mapping.out +","+mapping.type+";";
                            })
                            actions.push(this.state.newActionId + ":"+newMapping);
                            this.setState({
                                openAddActionDialog: false,
                                actions,
                                newActionId:"",
                                newMapping:[]
                            });
                        }} color="accent">Добавить</Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : this.state.actionsRegistry.filter(action =>
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
    onSuggestionsFetchRequested = ({value}) => {
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

    renderEditionForm() {

        return (
            <div className={"dialog__content"}>
                <TextField onChange={this.handleChange("name")}
                           value={this.state.name} label="name"/>
                <TextField onChange={this.handleChange("code")}
                           value={this.state.code} label="code"/>
                <TextField onChange={this.handleChange("description")}
                           value={this.state.description} label="description"/>
                {this.renderOperationActions()}
                {this.renderInParams()}
                {this.renderOutParams()}
                <Button raised={true} type="submit" onClick={() => {
                    this.closeEditDialog();
                    this.handleEditOperation(this.state.target)
                }
                } color="accent">РЕДАКТИРОВАТЬ</Button>
            </div>
        );
    }

    handleEditOperation(operation) {
        let name = this.state.name;
        let code = this.state.code;
        let description = this.state.description;
        let inParams = this.state.inParams.join("");
        let outParams = this.state.outParams.join("");
        let actions = this.state.actions.join("!");
        console.log(operation.id + " " + name + " " + code + " " + actions + " " + description + " " + inParams + " " + outParams);
        let url = "http://localhost:8080/api/operations/edit?"
            + "id=" + operation.id;
        if (name) {
            url += "&name=" + name;
        }
        if (code) {
            url += "&code=" + code;
        }
        if (description) {
            url += "&description=" + description;
        }
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

    render() {

        return (
            <Paper>
                <div style={{"text-align": "center", "padding": "10px"}}>
                    <Button raised color="accent" onClick={this.openDialog}>
                        Создать операцию
                    </Button>
                </div>
                {this.renderAddParamDialog()}
                {this.renderAddActionDialog()}
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
            actions: [],
            inParams: [],
            outParams: [],
        });
    }

    renderOperationActions() {
        return(
            <div>
                <Typography type="subheading" gutterBottom>{"Actions"}</Typography>
                {this.state.actions.map((action,index) => {
                    const split = action.split(":");
                    return <div>
                        <span>{split[0]}</span>
                        <Remove onClick={() => {
                            let actions = [...this.state.actions];
                            actions.splice(index, 1);
                            this.setState({actions});
                        }}/>
                    </div>
                })}
                <Button raised={true} onClick={() => {
                    this.setState({openAddActionDialog: true});
                }}>Добавить действие</Button>
            </div>
        );
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
                    <Suggest value={this.state.newParamCode} onChange={(e,{newValue})=>{
                        this.setState({newParamCode:newValue});
                    }}
                             suggestions={this.state.dynamicParams}
                             placeholder="Type dynamic param code" field={"code"}/>
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
                            newParamCode,
                            newParamRequired,
                            newParamKeepInWorkflow,
                            newParamDefaultValue
                        } = this.state;
                        const newParamId = this.state.dynamicParams.filter((param)=>{
                            return param.code == newParamCode;
                        })[0].id;
                        const newParam = newParamId + ","
                            + newParamRequired + ","
                            + newParamKeepInWorkflow + ","
                            + newParamDefaultValue + ";";
                        params.push(newParam);
                        const state = {...this.state};
                        state[this.state.newParamType] = params;
                        state.openedAddParamDialog = false;
                        state.newParamCode = "";
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