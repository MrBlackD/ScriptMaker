import React, {Component} from "react";
import * as funcs from "../utils/requests";
import Action from "./Action";
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

export default class Actions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createDialogOpened: false,
            editionDialogOpened: false,
            targetId: 0,
            deleteConfirmDialogOpened: false,
            actions: {},
            inParams:[],
            outParams:[],
            dynamicParams:[]
        };
        this.handleRequestEditDialog = this.handleRequestEditDialog.bind(this);
        this.handleRequestCreateDialog = this.handleRequestCreateDialog.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        funcs.get("http://localhost:8080/api/dynamicParams", (response, status, statusText) => {
            console.log(response);
            let res = JSON.parse(response);
            console.log(res);
            if (status !== 200) {
                console.log(statusText);
            } else {
                this.setState({dynamicParams: res});
            }
        });
        funcs.get("http://localhost:8080/api/actions", (response, status, statusText) => {
            console.log(response);
            let res = JSON.parse(response);
            console.log(res);
            if (status !== 200) {
                console.log(statusText);
            } else {
                this.setState({actions: res});
            }
        });
    }

    handleCreateParam() {
        this.clearForm();
        let name = this.newName.value;
        this.newName.value = "";
        let code = this.newCode.value;
        this.newCode.value = "";
        let module = this.newModule.value;
        this.newModule.value = "";
        let description = this.newDescription.value;
        this.newDescription.value = "";

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
        if(this.state.outParams){
            this.state.dynamicParams.forEach((param) =>{
                this.state.outParams.forEach((outParamCode) =>{
                    if(param.code === outParamCode){
                        outParams += param.id + ",";
                    }
                })

            })
        }
        console.log(name + " " + code + " " + module + " " + description + " " + inParams + " " + outParams);
        let url = "http://localhost:8080/api/actions/new?"
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

        funcs.get(url, (response, status, statusText) => {
            console.log(response);
            console.log(statusText);
            this.loadData();
        });
    }

    handleEditParam(id) {
        let name = this.editName.value;
        this.editName.value = "";
        let code = this.editCode.value;
        this.editCode.value = "";
        let module = this.editModule.value;
        this.editModule.value = "";
        let description = this.editDescription.value;
        this.editDescription.value = "";
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
        console.log(id + " " + name + " " + code + " " + module + " " + description + " " + inParams + " " + outParams);
        let url = "http://localhost:8080/api/actions/edit?"
            + "id=" + id;
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

        funcs.get(url, (response, status, statusText) => {
            console.log(response);
            console.log(statusText);
            this.loadData();
        });

    }

    handleDelete(id) {
        let url = "http://localhost:8080/api/actions/delete?id=" + id;
        funcs.get(url, (response, status, statusText) => {
            console.log(response);
            console.log(statusText);
            this.loadData();
        });
    }

    renderActions() {
        let params = this.state.actions;
        let actions = [];
        for (let i = 0; i < params.length; i++) {
            actions.push(<Action onDelete={(id) => this.openDeleteDialog(id)} onEdit={(id) => this.openEditDialog(id)}
                                 key={i} data={params[i]}/>);
        }
        return actions;
    }

    handleRequestCreateDialog() {
        this.setState({createDialogOpened: false});
    }

    handleRequestEditDialog() {
        this.setState({editionDialogOpened: false});
    }

    openDeleteDialog(id) {
        this.setState({deleteConfirmDialogOpened: true, targetId: id});
    }

    openEditDialog(id) {
        let actions = this.state.actions;
        let action;
        for (let i = 0; i < actions.length; i++) {
            if (actions[i].id === id) {
                action = actions[i];
                break;
            }
        }
        let inParams = [];
        if (action.inParams) {
            action.inParams.map((item) => {
                inParams.push(item.code)
            });
        }
        let outParams = [];
        if (action.outParams) {
            action.outParams.map((item) => {
                outParams.push(item.code)
            });
        }
        console.log("inParams",inParams);
        this.setState({editionDialogOpened: true, targetId: id,inParams:inParams,outParams:outParams});
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
                        input={<Input id="outParams" />}>
                    {this.state.dynamicParams.map(param => (
                        <MenuItem key={param.id} value={param.code}>
                            <Checkbox checked={Object.values(this.state.outParams).includes(param.code)} />
                            <ListItemText primary={param.code} />
                        </MenuItem>
                    ))}
                </Select>

                <Button raised={true} onClick={() => {
                    this.handleRequestCreateDialog();
                    this.handleCreateParam()
                }}>Создать действие</Button>
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
        let actions = this.state.actions;
        let action;
        for (let i = 0; i < actions.length; i++) {
            if (actions[i].id === this.state.targetId) {
                action = actions[i];
                break;
            }
        }
        if (!action)
            return null;



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
                        input={<Input id="outParams" />}>
                    {this.state.dynamicParams.map(param => (
                        <MenuItem key={param.id} value={param.code}>
                            <Checkbox checked={Object.values(this.state.outParams).includes(param.code)} />
                            <ListItemText primary={param.code} />
                        </MenuItem>
                    ))}
                </Select>
                <Button raised={true} type="submit" onClick={() => {
                    this.handleRequestEditDialog();
                    this.handleEditParam(this.state.targetId)
                }}>Edit</Button>
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
                </div>
                {this.renderCreationDialog()}
                {this.renderDeleteConfirmDialog()}
                {this.renderEditionDialog()}
                {this.renderActions()}
            </Paper>
        )
    }

    clearForm() {
        this.setState({inParams:[]});
    }
}