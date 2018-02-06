import React, {Component} from "react";
import Action from "./Action";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
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
import {Remove} from "material-ui-icons";
import Suggest from "./Suggest";
import SearchField from "./SearchField";

export default class Actions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createDialogOpened: false,
            editionDialogOpened: false,
            targetId: 0,
            target: {},
            deleteConfirmDialogOpened: false,
            openedAddParamDialog: false,
            actions: [],
            inParams: [],
            outParams: [],
            dynamicParams: [],
            newParamCode: "",
            newParamRequired: false,
            newParamKeepInWorkflow: false,
            newParamDefaultValue: "",
            newParamType: "",
            filteredActions: []
        };
        this.handleRequestEditDialog = this.handleRequestEditDialog.bind(this);
        this.handleRequestCreateDialog = this.handleRequestCreateDialog.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        fetch(window.location.origin + "/api/dynamicParams").then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            this.setState({dynamicParams: json});

        });
        fetch(window.location.origin + "/api/actions").then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            this.setState({
                actions: json,
                filteredActions: json
            });

        });

    }

    handleCreateAction() {
        this.clearForm();
        let name = this.newName.value;
        this.newName.value = "";
        let code = this.newCode.value;
        this.newCode.value = "";
        let module = this.newModule.value;
        this.newModule.value = "";
        let description = this.newDescription.value;
        this.newDescription.value = "";
        let inParams = this.state.inParams.join("");
        let outParams = this.state.outParams.join("");
        console.log(name + " " + code + " " + module + " " + description + " " + inParams + " " + outParams);
        let url = window.location.origin + "/api/actions/new?"
            + "name=" + name
            + "&code=" + code
            + "&module=" + module
            + "&description=" + description;
        if (inParams) {
            url += "&inParams=" + inParams;
        }
        if (outParams) {
            url += "&outParams=" + outParams;
        }
        fetch(url).then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            this.loadData();
        });
    }

    handleEditAction(action) {
        let name = this.editName.value;
        this.editName.value = "";
        let code = this.editCode.value;
        this.editCode.value = "";
        let module = this.editModule.value;
        this.editModule.value = "";
        let description = this.editDescription.value;
        this.editDescription.value = "";
        let inParams = this.state.inParams.join("");
        let outParams = this.state.outParams.join("");
        console.log(action.id + " " + name + " " + code + " " + module + " " + description + " " + inParams + " " + outParams);
        let url = window.location.origin + "/api/actions/edit?"
            + "id=" + action.id;
        if (name) {
            url += "&name=" + name;
        }
        if (code) {
            url += "&code=" + code;
        }
        if (module) {
            url += "&module=" + module;
        }
        if (description) {
            url += "&description=" + description;
        }
        if (inParams) {
            url += "&inParams=" + inParams;
        }
        if (outParams) {
            url += "&outParams=" + outParams;
        }
        fetch(url).then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            this.loadData();
        });

    }

    handleDelete(id) {
        let url = window.location.origin + "/api/actions/delete?id=" + id;
        fetch(url).then((response) => {
            console.log(response);
            this.loadData();
        });
    }

    renderActions() {
        let params = this.state.filteredActions;

        let actions = [];
        for (let i = 0; i < params.length; i++) {
            actions.push(<Action onDelete={(id) => this.openDeleteDialog(id)}
                                 onEdit={(action) => this.openEditDialog(action)}
                                 key={i} data={params[i]}/>);
        }
        return actions;
    }

    handleRequestCreateDialog() {
        this.setState({createDialogOpened: false});
    }

    handleRequestEditDialog() {
        this.setState({editionDialogOpened: false,inParams:[],outParams:[]});
    }

    openDeleteDialog(id) {
        this.setState({deleteConfirmDialogOpened: true, targetId: id,inParams:[],outParams:[]});
    }

    openEditDialog(action) {
        console.log("action", action);
        let inParams = [];
        action.inParams.forEach(({dynamicParam, required, keepInWorkflow, defaultValue}) => {
            inParams.push(dynamicParam.id + ","
                + required + ","
                + keepInWorkflow + ","
                + defaultValue + ";");
        });
        let outParams = [];
        action.outParams.forEach(({dynamicParam, required, keepInWorkflow, defaultValue}) => {
            outParams.push(dynamicParam.id + ","
                + required + ","
                + keepInWorkflow + ","
                + defaultValue + ";");
        });
        this.setState({
            editionDialogOpened: true,
            target: action,
            inParams: inParams,
            outParams: outParams
        });
    }

    renderDeleteConfirmDialog() {
        return (
            <Dialog open={this.state.deleteConfirmDialogOpened}>
                <DialogTitle>
                    {"Удаление"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {"Удалить действие?"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        this.setState({deleteConfirmDialogOpened: false});
                        this.handleDelete(this.state.targetId)
                    }
                    } color="accent" raised>{"Удалить"}</Button>
                    <Button onClick={() => this.setState({deleteConfirmDialogOpened: false})} raised>{"Отмена"}</Button>
                </DialogActions>
            </Dialog>
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
                    <Suggest value={this.state.newParamCode} onChange={(e,{newValue}) =>{
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
                        const newParamId = this.state.dynamicParams.filter((param) =>{
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

    renderCreationDialog() {
        return (
            <Dialog classes={{paper: "dialog"}} open={this.state.createDialogOpened}
                    onClose={this.handleRequestCreateDialog}>
                <DialogTitle>
                    <Typography type="headline" gutterBottom>{"Создание действия"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root: "content"}}>
                    {this.renderCreationForm()}
                </DialogContent>
            </Dialog>
        );
    }

    renderCreationForm() {

        return (
            <div className={"dialog__content"}>
                <TextField inputRef={(input) => {
                    this.newName = input;
                }} label="name" id="newName" required={true}/>
                <TextField inputRef={(input) => {
                    this.newCode = input;
                }} label="code" id="newCode" required={true}/>
                <TextField inputRef={(input) => {
                    this.newModule = input;
                }} label="module" id="newModule" required={true}/>
                <TextField inputRef={(input) => {
                    this.newDescription = input;
                }} label="description" id="newDescription" required={true}/>
                {this.renderInParams()}
                {this.renderOutParams()}
                <Button raised={true} onClick={() => {
                    this.handleRequestCreateDialog();
                    this.handleCreateAction()
                }} color="accent">Создать действие</Button>
            </div>
        );
    }


    renderEditionDialog() {
        return (
            <Dialog classes={{paper: "dialog"}} open={this.state.editionDialogOpened}
                    onClose={this.handleRequestEditDialog}>
                <DialogTitle>
                    <Typography type="headline" gutterBottom>{"Редактирование действия"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root: "content"}}>
                    {this.renderEditionForm()}
                </DialogContent>
            </Dialog>
        );
    }

    renderEditionForm() {
        let action = this.state.target;
        if (!action) {
            return null;
        }


        return (
            <div className={"dialog__content"}>
                <TextField inputRef={(input) => {
                    this.editName = input;
                }}
                           defaultValue={action.name} label="name" id="editName"/>
                <TextField inputRef={(input) => {
                    this.editCode = input;
                }}
                           defaultValue={action.code} label="code" id="editCode"/>
                <TextField inputRef={(input) => {
                    this.editModule = input;
                }}
                           defaultValue={action.module} label="module" id="editModule"/>
                <TextField inputRef={(input) => {
                    this.editDescription = input;
                }}
                           defaultValue={action.description} label="description" id="editDescription"/>
                {this.renderInParams()}
                {this.renderOutParams()}
                <Button raised={true} type="submit" onClick={() => {
                    this.handleRequestEditDialog();
                    this.handleEditAction(this.state.target)
                }} color="accent">Edit</Button>
            </div>
        );
    }

    render() {
        return (
            <Paper>
                <div style={{"text-align": "center", "padding": "10px"}}>
                    <Button onClick={() => {
                        this.setState({createDialogOpened: true});
                    }} raised color="accent">Создать действие</Button>
                    <div>
                        <SearchField values={this.state.actions}
                                      field="code"
                                      onChange={(value) =>{this.setState({filteredActions: value})}}
                        />
                    </div>
                </div>

                {this.renderAddParamDialog()}
                {this.renderCreationDialog()}
                {this.renderDeleteConfirmDialog()}
                {this.renderEditionDialog()}
                {this.renderActions()}
            </Paper>
        )
    }

    clearForm() {
        this.setState({inParams: []});
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
}