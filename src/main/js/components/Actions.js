import React, {Component} from "react";
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
    TextField,
    Typography
} from "material-ui";
import Suggest from "./Suggest";
import SearchField from "./SearchField";
import {connect} from "react-redux";
import ActionsList from "./Actions/ActionsList";
import ParamsTable from "./ParamsTable/ParamsTable";

class Actions extends Component {
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
            newName: "",
            newCode: "",
            newDescription: "",
            newModule: "dul-module",
            editName: "",
            editCode: "",
            editModule: "",
            editDescription: "",
            newParamCode: "",
            newParamRequired: true,
            newParamKeepInWorkflow: false,
            newParamDefaultValue: "",
            newParamType: "",
            filteredActions: []
        };
        this.handleRequestEditDialog = this.handleRequestEditDialog.bind(this);
        this.handleRequestCreateDialog = this.handleRequestCreateDialog.bind(this);
        this.onRemoveParam = this.onRemoveParam.bind(this);
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

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleCreateAction() {
        this.clearForm();
        let name = this.state.newName;
        let code = this.state.newCode;
        let module = this.state.newModule;
        let description = this.state.newDescription;
        let inParams = JSON.stringify(this.state.inParams);
        let outParams = JSON.stringify(this.state.outParams);
        console.log(name + " " + code + " " + module + " " + description + " " + inParams + " " + outParams);
        let url = window.location.origin + "/api/actions/new?"
            + "name=" + encodeURIComponent(name)
            + "&code=" + encodeURIComponent(code)
            + "&module=" + encodeURIComponent(module)
            + "&description=" + encodeURIComponent(description);
        if (inParams) {
            url += "&inParams=" + encodeURIComponent(inParams);
        }
        if (outParams) {
            url += "&outParams=" + encodeURIComponent(outParams);
        }
        fetch(url).then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            this.loadData();
        });
    }

    handleEditAction(action) {
        let name = this.state.editName;
        let code = this.state.editCode;
        let module = this.state.editModule;
        let description = this.state.editDescription;
        let inParams = JSON.stringify(this.state.inParams);
        let outParams = JSON.stringify(this.state.outParams);
        console.log(action.id + " " + name + " " + code + " " + module + " " + description + " " + inParams + " " + outParams);
        let url = window.location.origin + "/api/actions/edit?"
            + "id=" + action.id;
        if (name) {
            url += "&name=" + encodeURIComponent(name);
        }
        if (code) {
            url += "&code=" + encodeURIComponent(code);
        }
        if (module) {
            url += "&module=" + encodeURIComponent(module);
        }
        if (description) {
            url += "&description=" + encodeURIComponent(description);
        }
        if (inParams) {
            url += "&inParams=" + encodeURIComponent(inParams);
        }
        if (outParams) {
            url += "&outParams=" + encodeURIComponent(outParams);
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


    handleRequestCreateDialog() {
        this.setState({createDialogOpened: false});
    }

    handleRequestEditDialog() {
        this.setState({editionDialogOpened: false, inParams: [], outParams: []});
    }

    openDeleteDialog(id) {
        this.setState({deleteConfirmDialogOpened: true, targetId: id, inParams: [], outParams: []});
    }

    openEditDialog(action) {
        let inParams = [];
        action.inParams.forEach(({dynamicParam, required, keepInWorkflow, defaultValue}) => {

            inParams.push({
                id: dynamicParam.id,
                required,
                keepInWorkflow,
                defaultValue
            });
        });
        let outParams = [];
        action.outParams.forEach(({dynamicParam, required, keepInWorkflow, defaultValue}) => {
            outParams.push({
                id: dynamicParam.id,
                required,
                keepInWorkflow,
                defaultValue
            });
        });
        this.setState({
            editionDialogOpened: true,
            target: action,
            editName: action.name,
            editCode: action.code,
            editModule: action.module,
            editDescription: action.description,
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
                    } color="secondary" variant="raised">{"Удалить"}</Button>
                    <Button onClick={() => this.setState({deleteConfirmDialogOpened: false})}
                            variant="raised">{"Отмена"}</Button>
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
                    <Typography variant="headline" gutterBottom>{"Динамический параметр"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root: "content"}}>
                    <Suggest value={this.state.newParamCode} onChange={(e, {newValue}) => {
                        this.setState({newParamCode: newValue});
                    }}
                             suggestions={this.state.dynamicParams}
                             placeholder="Код динамического параметра" field={"code"}/>
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
                    <Button variant="raised"
                            disabled={this.state.dynamicParams.filter(param => param.code == this.state.newParamCode).length == 0}
                            onClick={() => {
                                let params = this.state[this.state.newParamType].slice();
                                const {
                                    newParamCode,
                                    newParamRequired,
                                    newParamKeepInWorkflow,
                                    newParamDefaultValue
                                } = this.state;
                                const newParamId = this.state.dynamicParams.filter((param) => {
                                    return param.code == newParamCode;
                                })[0].id;
                                if (params.filter(param => param.id == newParamId).length > 0) {
                                    console.error("Параметр " + this.state.newParamCode
                                        + " уже добавлен в " + this.state.newParamType);
                                    this.setState({openedAddParamDialog: false})
                                    return;
                                }


                                const newParam = {
                                    id: newParamId,
                                    required: newParamRequired,
                                    keepInWorkflow: newParamKeepInWorkflow,
                                    defaultValue: newParamDefaultValue
                                }
                                params.push(newParam);
                                const state = {...this.state};
                                state[this.state.newParamType] = params;
                                state.openedAddParamDialog = false;
                                state.newParamCode = "";
                                state.newParamRequired = true;
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
                    <Typography variant="headline" gutterBottom>{"Создание действия"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root: "content"}}>
                    {this.renderCreationForm()}
                </DialogContent>
                <DialogActions className={"dialog__actions"}>
                    <Button variant="raised" onClick={() => {
                        this.handleRequestCreateDialog();
                        this.handleCreateAction()
                    }} color="secondary">Создать действие</Button>
                </DialogActions>
            </Dialog>
        );
    }

    renderCreationForm() {

        return (
            <div className={"dialog__content"}>
                <TextField onChange={this.handleChange("newName")} label="name" required={true}/>
                <TextField onChange={this.handleChange("newCode")} label="code" required={true}/>
                <TextField onChange={this.handleChange("newModule")} value={this.state.newModule} label="module"
                           required={true}/>
                <TextField onChange={this.handleChange("newDescription")} label="description" multiline rows={4}
                           required={true}/>
                {this.renderParams("inParams")}
                {this.renderParams("outParams")}
            </div>
        );
    }


    renderEditionDialog() {
        return (
            <Dialog classes={{paper: "dialog"}} open={this.state.editionDialogOpened}
                    onClose={this.handleRequestEditDialog}>
                <DialogTitle>
                    <Typography variant="headline" gutterBottom>{"Редактирование действия"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root: "content"}}>
                    {this.renderEditionForm()}
                </DialogContent>
                <DialogActions className={"dialog__actions"}>
                    <Button variant="raised" type="submit" onClick={() => {
                        this.handleRequestEditDialog();
                        this.handleEditAction(this.state.target)
                    }} color="secondary">ПРИМЕНИТЬ</Button>
                </DialogActions>
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
                <TextField onChange={this.handleChange("editName")} value={this.state.editName} label="name"/>
                <TextField onChange={this.handleChange("editCode")} value={this.state.editCode} label="code"/>
                <TextField onChange={this.handleChange("editModule")} value={this.state.editModule} label="module"/>
                <TextField onChange={this.handleChange("editDescription")} value={this.state.editDescription} multiline
                           rows={4}
                           label="description"/>
                {this.renderParams("inParams")}
                {this.renderParams("outParams")}
            </div>
        );
    }

    render() {
        return (
            <Paper>
                <div style={{"text-align": "center", "padding": "10px"}}>
                    <Button onClick={() => {
                        this.setState({createDialogOpened: true});
                    }} variant="raised" color="secondary">Создать действие</Button>
                    <div>
                        <SearchField values={this.state.actions}
                                     field="code"
                                     onChange={(value) => {
                                         this.setState({filteredActions: value})
                                     }}
                        />
                    </div>
                </div>

                {this.renderAddParamDialog()}
                {this.renderCreationDialog()}
                {this.renderDeleteConfirmDialog()}
                {this.renderEditionDialog()}
                <ActionsList actions={this.state.filteredActions}
                             onDelete={this.openDeleteDialog}
                             onEdit={(action) => this.openEditDialog(action)}/>
            </Paper>
        )
    }

    clearForm() {
        this.setState({inParams: [], outParams: [], newModule: "dul-module"});
    }

    renderParams(paramsType) {
        const title = paramsType == "inParams" ? "Исходящие параметры" : "Входящие параметры"
        return (
            <div>
                <Typography variant="subheading" gutterBottom>{title}</Typography>
                <Button variant="raised" onClick={() => {
                    this.setState({openedAddParamDialog: true, newParamType: paramsType});
                }}>Добавить входящий параметр</Button>
                <ParamsTable params={this.state[paramsType]}
                             paramsType={paramsType}
                             dynamicParams={this.state.dynamicParams}
                             onRemoveClick={this.onRemoveParam}/>
            </div>
        );
    }

    onRemoveParam(param, paramsType) {
        let resultParams = [...this.state[paramsType]];
        const indexes = resultParams.map((item) => Number(item.id))
        resultParams.splice(indexes.indexOf(param.id), 1);
        const state = {...this.state};
        state[paramsType] = resultParams;
        this.setState(state);

    }

}

export default connect(state => ({test: state.actions}))(Actions)