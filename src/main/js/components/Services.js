import React, {Component} from "react";

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
    TextField,
    Typography
} from "material-ui";
import {Remove} from "material-ui-icons";
import Suggest from "./Suggest";
import SearchField from "./SearchField";
import Params from "./Params";
import Element from "./Element";


export default class Services extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            code: "",
            description: "dul-module",
            targetId: 0,
            target: {},
            inParams: [],
            outParams: [],
            operations: [],
            newOperationCode: "",
            services: [],
            createDialogOpened: false,
            dynamicParams: [],
            operationsRegistry: [],
            newParamCode: "",
            newParamRequired: false,
            newParamKeepInWorkflow: false,
            newParamDefaultValue: "",
            newParamType: "",
            filteredServices: [],
            openAddOperationDialog: false
        };
        this.closeDialog = this.closeDialog.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.clearState = this.clearState.bind(this);

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
        fetch(window.location.origin + "/api/operations").then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            this.setState({operationsRegistry: json});
        });
        fetch(window.location.origin + "/api/services").then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            this.setState({
                services: json,
                filteredServices: json
            });
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
                    <Typography variant="headline" gutterBottom>{"Создание сервиса"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root: "content"}}>
                    {this.renderCreationForm()}
                </DialogContent>
                <DialogActions className={"dialog__actions"}>
                    <Button variant="raised" onClick={() => {
                        this.closeDialog();
                        this.clearState();
                        this.createService();
                    }} color="secondary">{"Создать сервис"}</Button>
                </DialogActions>
            </Dialog>
        );
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    onDropElement = (prevId, nextId) => {
        const operations = this.state.operations.slice();
        const prevItem = operations.splice(prevId, 1)[0];
        operations.splice(nextId, 0, prevItem);
        this.setState({operations})
    }
    renderOperations = () => {

        return this.state.operations.map((id, index) => {
            const operation = this.state.operationsRegistry.filter((operation) => {
                return operation.id === id
            })[0];
            return <Element onDropElement={this.onDropElement} key={index} index={index}>
                <span>{operation.name + " ( " + operation.code + " ) "}</span>
                <Remove onClick={() => {
                    let operations = [...this.state.operations];
                    operations.splice(index, 1);
                    this.setState({operations});
                }}/>
            </Element>

        });

    }

    renderOperationsInputs = () => {

        return this.state.operations.map((operation, index) => {
            return <div key={index}>

                <Suggest value={this.state.operations[index]}
                         onChange={(e, {newValue}) => {
                             let operations = [...this.state.operations];
                             operations[index] = newValue;
                             this.setState({operations});
                         }}
                         suggestions={this.state.operationsRegistry}
                         placeholder="Код операции" field={"code"}
                />
                <Remove onClick={() => {
                    let operations = [...this.state.operations];
                    operations.splice(index, 1);
                    this.setState({operations});
                }}/>
            </div>
        });

    }

    renderAddOperationDialog() {
        return (
            <Dialog classes={{paper: "dialog"}} open={this.state.openAddOperationDialog}
                    onClose={() => {
                        this.setState({openAddOperationDialog: false})
                    }}>
                <DialogTitle>
                    <Typography variant="headline" gutterBottom>{"Добавление операции"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root: "content"}}>

                    <Suggest value={this.state.newOperationCode}
                             onChange={(e, {newValue}) => {
                                 this.setState({newOperationCode: newValue});
                             }}
                             suggestions={this.state.operationsRegistry}
                             placeholder="Код операции" field={"code"}
                    />
                    <div>
                        <Button variant="raised" type="submit" onClick={() => {
                            let newOperationId = this.state.operationsRegistry.filter((opertaion) => {
                                return opertaion.code === this.state.newOperationCode;
                            })[0].id;
                            const operations = this.state.operations.slice();
                            operations.push(newOperationId);
                            this.setState({
                                openAddOperationDialog: false,
                                operations,
                                newOperationCode: ""
                            });
                        }} color="secondary">Добавить</Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }


    renderCreationForm() {
        return (
            <div className={"dialog__content"}>
                <TextField onChange={this.handleChange("name")} label="name" required={true}/>
                <TextField onChange={this.handleChange("code")} label="code" required={true}/>
                <TextField onChange={this.handleChange("description")} label="description" multiline rows={4} required={true}/>
                <InputLabel>Operations</InputLabel>
                {this.renderOperations()}
                <Button variant="raised" onClick={() => {
                    this.setState({openAddOperationDialog: true});
                }}>Добавить операцию</Button>

                {this.renderInParams()}
                {this.renderOutParams()}

            </div>
        );
    }


    createService() {
        let name = this.state.name;
        let code = this.state.code;
        let description = this.state.description;
        let inParams = this.state.inParams.join("");
        let outParams = this.state.outParams.join("");
        let operations = this.state.operations.join(",");

        console.log(name + " " + code + " " + description + " " + operations + " " + inParams + " " + outParams);
        let url = window.location.origin + "/api/services/new?"
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
        fetch(url).then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            this.loadData();
        });
    }

    renderServices() {
        let params = this.state.filteredServices;
        let services = [];
        for (let i = 0; i < params.length; i++) {
            services.push(<Service key={i} data={params[i]}
                                   onDelete={this.openDeleteService}
                                   onEdit={this.openEditService}/>);
        }
        return services;
    }

    renderDeleteConfirmService() {
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
                    <Button onClick={() => {
                        this.setState({showDeleteDialog: false});
                        this.handleDelete(this.state.targetId)
                    }
                    } color="secondary" variant="raised">{"Удалить"}</Button>
                    <Button onClick={() => this.setState({showDeleteDialog: false})}
                            variant="raised">{"Отмена"}</Button>
                </DialogActions>
            </Dialog>
        );
    }

    openDeleteService = (id) => {
        this.setState({showDeleteDialog: true, targetId: id});
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

        let operations = [];
        if (service.operations) {
            service.operations.map((item) => {
                operations.push(item.id)
            });
        }
        this.setState({
            showEditDialog: true,
            target: service,
            name: service.name,
            code: service.code,
            description: service.description,
            operations: operations,
            inParams: inParams,
            outParams: outParams
        });
    }

    handleDelete(id) {
        let url = window.location.origin + "/api/services/delete?id=" + id;
        fetch(url).then((response) => {
            console.log(response);
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
                    <Typography variant="headline" gutterBottom>{"Редактирование сервиса"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root: "content"}}>
                    {this.renderEditionForm()}
                </DialogContent>
                <DialogActions className={"dialog__actions"}>
                    <Button variant="raised" type="submit" onClick={() => {
                        this.closeEditDialog();
                        this.handleEditService(this.state.target)
                    }
                    } color="secondary">ПРИМЕНИТЬ</Button>
                </DialogActions>
            </Dialog>
        );
    }

    renderEditionForm() {
        return (
            <div className={"dialog__content"}>
                <TextField onChange={this.handleChange("name")}
                           value={this.state.name} label="name"/>
                <TextField onChange={this.handleChange("code")}
                           value={this.state.code} label="code"/>
                <TextField onChange={this.handleChange("description")}
                           value={this.state.description} multiline rows={4} label="description"/>
                <InputLabel>Operations</InputLabel>
                {this.renderOperations()}
                <Button variant="raised" onClick={() => {
                    this.setState({openAddOperationDialog: true});
                }}>Добавить операцию</Button>
                {this.renderInParams()}
                {this.renderOutParams()}
            </div>
        );
    }

    handleEditService(operation) {
        let name = this.state.name;
        let code = this.state.code;
        let description = this.state.description;
        let inParams = this.state.inParams.join("");
        let outParams = this.state.outParams.join("");
        let operations = this.state.operations.join(",");

        console.log(operation.id + " " + name + " " + code + " " + operations + " " + description + " " + inParams + " " + outParams);
        let url = window.location.origin + "/api/services/edit?"
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
        if (operations) {
            url += "&operations=" + operations;
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

    render() {

        return (
            <Paper>


                <div style={{"text-align": "center", "padding": "10px"}}>
                    <div>
                        <Button variant="raised" onClick={() => {
                            window.open(window.location.origin + "/download");
                        }}>Download XLSX</Button>
                    </div>
                    <Button variant="raised" color="secondary" onClick={this.openDialog}>
                        Создать сервис
                    </Button>
                    <div>
                        <SearchField values={this.state.services}
                                     field="code"
                                     onChange={(value) => {
                                         this.setState({filteredServices: value})
                                     }}
                        />
                    </div>
                </div>
                {this.renderAddOperationDialog()}
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
            description: "dul-module",
            module: "",
            actions: "",
            inParams: [],
            outParams: [],
        });
    }

    renderInParams() {
        return (
            <div>
                <Typography variant="subheading" gutterBottom>{"Входящие параметры"}</Typography>

                <Button variant="raised" onClick={() => {
                    this.setState({openedAddParamDialog: true, newParamType: "inParams"});
                }}>Добавить входящий параметр</Button>
                {this.renderTableParams("inParams")}
            </div>
        );
    }

    renderOutParams() {
        return (
            <div>
                <Typography variant="subheading" gutterBottom>{"Исходящие параметры"}</Typography>

                <Button variant="raised" onClick={() => {
                    this.setState({openedAddParamDialog: true, newParamType: "outParams"});
                }}>Добавить исходящий параметр</Button>
                {this.renderTableParams("outParams")}
            </div>
        );
    }

    renderTableParams(params) {
        const resultParams = this.state[params].map((param) => {
            const splittedParam = param.slice(0, param.length - 1).split(",");
            const paramInst = this.state.dynamicParams.filter((param) => param.id == splittedParam[0])[0];
            return {
                id: paramInst.id,
                code: paramInst.code,
                name: paramInst.name,
                required: splittedParam[1],
                keepInWorkflow: splittedParam[2],
                defaultValue: splittedParam[3],
            }
        });
        return <Params params={resultParams} onRemoveClick={(param) => {
            let resultParams = [...this.state[params]];
            resultParams.splice(resultParams.indexOf(param), 1);
            const state = {...this.state};
            state[params] = resultParams;
            this.setState(state);
        }}/>
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
                                if (params.filter(param => param.split(",")[0] == newParamId).length > 0) {
                                    console.error("Параметр " + this.state.newParamCode
                                        + " уже добавлен в " + this.state.newParamType);
                                    this.setState({openedAddParamDialog:false})
                                    return;
                                }


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