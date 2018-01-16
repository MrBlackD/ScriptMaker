import React, {Component} from "react";
import * as funcs from "../utils/requests";
import Operation from "./Operation";
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
import Autosuggest from "react-autosuggest";
import {Add, Remove} from "material-ui-icons";


export default class Operations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            code: "",
            description: "",
            actions: [""],
            inParams: "",
            outParams: "",
            operations: {},
            createDialogOpened: false,
            dynamicParams: [],
            actionsRegistry: [],
            value:"",
            suggestions: []
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
                value:value,
                onChange: (event,{newValue}) => {
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
                <InputLabel>Actions</InputLabel>
                {this.renderActionsInputs()}
                <Add onClick={() => {
                    let actions = [...this.state.actions];
                    actions.push("");
                    this.setState({actions});
                }}/>
                <InputLabel htmlFor="inParams">inParams</InputLabel>
                <Select multiple value={[...this.state.inParams]}
                        renderValue={selected => selected.join(', ')}
                        onChange={(e) => {
                            this.setState({inParams: e.target.value})
                        }}
                        input={<Input id="inParams"/>}>
                    {this.state.dynamicParams.map(param => (
                        <MenuItem key={param.id} value={param.code}>
                            <Checkbox checked={Object.values(this.state.inParams).includes(param.code)}/>
                            <ListItemText primary={param.code}/>
                        </MenuItem>
                    ))}
                </Select>
                <InputLabel htmlFor="outParams">outParams</InputLabel>
                <Select multiple value={[...this.state.outParams]}
                        renderValue={selected => selected.join(', ')}
                        onChange={(e) => {
                            this.setState({outParams: e.target.value})
                        }}
                        input={<Input id="inParams"/>}>
                    {this.state.dynamicParams.map(param => (
                        <MenuItem key={param.id} value={param.code}>
                            <Checkbox checked={Object.values(this.state.outParams).includes(param.code)}/>
                            <ListItemText primary={param.code}/>
                        </MenuItem>
                    ))}
                </Select>
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
        let inParams = "";
        if (this.state.inParams) {
            this.state.dynamicParams.forEach((param) => {
                this.state.inParams.forEach((inParamCode) => {
                    if (param.code === inParamCode) {
                        inParams += param.id + ",";
                    }
                })

            })
        }

        let outParams = "";
        if (this.state.outParams) {
            this.state.dynamicParams.forEach((param) => {
                this.state.outParams.forEach((outParamCode) => {
                    if (param.code === outParamCode) {
                        outParams += param.id + ",";
                    }
                })
            })
        }
        let actions = "";
        if (this.state.actions) {
            this.state.actions.forEach((actionCode) => {
                this.state.actionsRegistry.forEach((action) => {
                    if (action.code === actionCode) {
                        actions += action.id + ",";
                    }
                })

            })
        }
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
    openEditOperation = (id) => {
        let operations = this.state.operations;
        let operation;
        for (let i = 0; i < operations.length; i++) {
            if (operations[i].id === id) {
                operation = operations[i];
                break;
            }
        }
        if (!operation)
            return null;
        let inParams = [];
        if (operation.inParams) {
            operation.inParams.map((item) => {
                inParams.push(item.code)
            });
        }

        let outParams = [];
        if (operation.outParams) {
            operation.outParams.map((item) => {
                outParams.push(item.code)
            });
        }

        let actions = [];
        if (operation.actions) {
            operation.actions.map((item) => {
                actions.push(item.code)
            });
        }
        this.setState({
            showEditDialog: true,
            targetId: id,
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
    renderEditionForm() {

        return (
            <div className={"dialog__content"}>
                <TextField onChange={this.handleChange("name")}
                           value={this.state.name} label="name"/>
                <TextField onChange={this.handleChange("code")}
                           value={this.state.code} label="code"/>
                <TextField onChange={this.handleChange("description")}
                           value={this.state.description} label="description"/>

                <InputLabel>Actions</InputLabel>
                {this.renderActionsInputs()}
                <Add onClick={() => {
                    let actions = [...this.state.actions];
                    actions.push("");
                    this.setState({actions});
                }}/>
                <InputLabel htmlFor="inParams">inParams</InputLabel>
                <Select multiple value={[...this.state.inParams]}
                        renderValue={selected => selected.join(', ')}
                        onChange={(e) => {
                            this.setState({inParams: e.target.value})
                        }}
                        input={<Input id="inParams"/>}>
                    {this.state.dynamicParams.map(param => (
                        <MenuItem key={param.id} value={param.code}>
                            <Checkbox checked={Object.values(this.state.inParams).includes(param.code)}/>
                            <ListItemText primary={param.code}/>
                        </MenuItem>
                    ))}
                </Select>
                <InputLabel htmlFor="outParams">outParams</InputLabel>
                <Select multiple value={[...this.state.outParams]}
                        renderValue={selected => selected.join(', ')}
                        onChange={(e) => {
                            this.setState({outParams: e.target.value})
                        }}
                        input={<Input id="outParams"/>}>
                    {this.state.dynamicParams.map(param => (
                        <MenuItem key={param.id} value={param.code}>
                            <Checkbox checked={Object.values(this.state.outParams).includes(param.code)}/>
                            <ListItemText primary={param.code}/>
                        </MenuItem>
                    ))}
                </Select>
                <Button raised={true} type="submit" onClick={() => {
                    this.closeEditDialog();
                    this.handleEditOperation(this.state.targetId)
                }
                }>РЕДАКТИРОВАТЬ</Button>
            </div>
        );
    }

    handleEditOperation(id) {
        let name = this.state.name;
        let code = this.state.code;
        let description = this.state.description;
        let inParams = "";
        if (this.state.inParams) {
            this.state.dynamicParams.forEach((param) => {
                this.state.inParams.forEach((inParamCode) => {
                    if (param.code === inParamCode) {
                        inParams += param.id + ",";
                    }
                })

            })
        }

        let outParams = "";
        if (this.state.outParams) {
            this.state.dynamicParams.forEach((param) => {
                this.state.outParams.forEach((outParamCode) => {
                    if (param.code === outParamCode) {
                        outParams += param.id + ",";
                    }
                })
            })
        }
        let actions = "";
        if (this.state.actions) {
            this.state.actions.forEach((actionCode) => {
                this.state.actionsRegistry.forEach((action) => {

                    if (action.code === actionCode) {
                        actions += action.id + ",";
                    }
                })

            })
        }
        console.log(id + " " + name + " " + code + " " + actions + " " + description + " " + inParams + " " + outParams);
        let url = "http://localhost:8080/api/operations/edit?"
            + "id=" + id;
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
            actions: [""],
            inParams: "",
            outParams: "",
        });
    }
}