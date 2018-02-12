import React, {Component} from "react";
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
    TextField,
    Typography
} from "material-ui";

import {Remove} from "material-ui-icons";
import Suggest from "./Suggest";
import SearchField from "./SearchField";
import Params from "./Params";
import Element from "./Element";


export default class Operations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            targetId:0,
            target:{},
            code: "",
            description: "dul-module",
            actions: [],
            inParams: [],
            outParams: [],
            operations: {},
            createDialogOpened: false,
            showEditDialog:false,
            dynamicParams: [],
            actionsRegistry: [],
            value: "",
            suggestions: [],
            openAddActionDialog: false,
            newActionCode:"",
            newMapping:[],
            newParamCode: "",
            newParamRequired: false,
            newParamKeepInWorkflow: false,
            newParamDefaultValue: "",
            newParamType: "",
            filteredOperations: []
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
        fetch(window.location.origin + "/api/actions").then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            this.setState({actionsRegistry: json});
        });
        fetch(window.location.origin + "/api/operations").then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            this.setState({
                operations: json,
                filteredOperations: json
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
                    <Typography variant="headline" gutterBottom>{"Создание операции"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root: "content"}}>
                    {this.renderCreationForm()}
                </DialogContent>
                <DialogActions className={"dialog__actions"}>
                    <Button variant="raised" onClick={() => {
                        this.closeDialog();
                        this.createOperation();
                    }} color="secondary">{"Создать операцию"}</Button>
                </DialogActions>
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
                {this.renderOperationActions()}
                {this.renderInParams()}
                {this.renderOutParams()}

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
        let url = window.location.origin + "/api/operations/new?"
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
        fetch(url).then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            this.loadData();
        });
    }

    renderOperations() {
        let params = this.state.filteredOperations;
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
                    } color="secondary" variant="raised">{"Удалить"}</Button>
                    <Button onClick={() => this.setState({showDeleteDialog: false})} variant="raised">{"Отмена"}</Button>
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
        let url = window.location.origin + "/api/operations/delete?id=" + id;
        fetch(url).then((response) => {
            console.log(response);
            this.loadData();
        });
    }

    closeEditDialog = () => {
        this.setState({showEditDialog: false,inParams:[],outParams:[]});
    }

    renderEditionDialog() {
        return (
            <Dialog classes={{paper: "dialog"}} open={this.state.showEditDialog}
                    onClose={this.closeEditDialog}>
                <DialogTitle>
                    <Typography variant="headline" gutterBottom>{"Редактирование операции"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root: "content"}}>
                    {this.renderEditionForm()}
                </DialogContent>
                <DialogActions className={"dialog__actions"}>
                    <Button variant="raised" type="submit" onClick={() => {
                        this.closeEditDialog();
                        this.handleEditOperation(this.state.target)
                    }
                    } color="secondary">ПРИМЕНИТЬ</Button>
                </DialogActions>
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
                    <Typography variant="headline" gutterBottom>{"Добавление действия"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root: "content"}}>
                    <Suggest value={this.state.newActionCode} onChange={(e,{newValue})=>{
                        this.setState({newActionCode:newValue});
                    }}
                             suggestions={this.state.actionsRegistry}
                             placeholder="Type action code" field={"code"}/>
                    {this.state.newMapping.map((mapping,index)=>{

                        return <div>
                            <TextField value={mapping.out}
                                       onChange={(e) => {
                                           const newMapping = this.state.newMapping;
                                           newMapping[index].out = e.target.value;
                                           this.setState({newMapping: newMapping})
                                       }}
                                       label="Параметр"/>
                            <TextField value={mapping.in}
                                       onChange={(e) => {
                                           const newMapping = this.state.newMapping;
                                           newMapping[index].in = e.target.value;
                                           this.setState({newMapping: newMapping})
                                       }}
                                       label="Значение"/>

                                <Select
                                value={mapping.type}
                                onChange={(e) => {
                                    const newMapping = this.state.newMapping;
                                    newMapping[index].type = e.target.value;
                                    this.setState({newMapping: newMapping})
                                }}
                                input={<Input name="type" id="type" />}
                                >
                                <MenuItem value="INPARAM">Входящий маппинг(параметр)</MenuItem>
                                <MenuItem value="INVALUE">Входящий маппинг(константа)</MenuItem>
                                <MenuItem value="OUTPARAM">Исходящий маппинг(параметр)</MenuItem>
                                <MenuItem value="OUTVALUE">Исходящий маппинг(константа)</MenuItem>
                            </Select>
                            <Remove onClick={() => {
                                let resultMapping = [...this.state.newMapping];
                                resultMapping.splice(index, 1);
                                this.setState({newMapping:resultMapping});
                            }}/>
                        </div>
                    })}
                    <div>

                        <Button variant="raised" type="submit" onClick={() => {
                            const mapping = this.state.newMapping.slice();
                            mapping.push({
                                in:"",
                                out:"",
                                type:"INPARAM"
                            })
                            this.setState({newMapping:mapping});
                        }}>Добавить маппинг</Button>
                    </div>
                    <div>
                        <Button variant="raised" type="submit" onClick={() => {
                            const actions = this.state.actions.slice();
                            let newMapping = "";
                            this.state.newMapping.forEach((mapping)=>{
                                newMapping += mapping.in +","+mapping.out +","+mapping.type+";";
                            })
                            let newActionId = this.state.actionsRegistry.filter((action)=>{
                                return action.code === this.state.newActionCode;
                            })[0].id;
                            actions.push(newActionId + ":"+newMapping);
                            this.setState({
                                openAddActionDialog: false,
                                actions,
                                newActionCode:"",
                                newMapping:[]
                            });
                        }} color="secondary">Добавить</Button>
                    </div>
                </DialogContent>
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
                           value={this.state.description} label="description"/>
                {this.renderOperationActions()}
                {this.renderInParams()}
                {this.renderOutParams()}
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
        let url = window.location.origin + "/api/operations/edit?"
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
                    <Button variant="raised" color="secondary" onClick={this.openDialog}>
                        Создать операцию
                    </Button>
                    <div>
                        <SearchField values={this.state.operations}
                                     field="code"
                                     onChange={(value) =>{this.setState({filteredOperations: value})}}
                        />
                    </div>
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
            description: "dul-module",
            module: "",
            actions: [],
            inParams: [],
            outParams: [],
        });
    }
    onDropElement =(prevId,nextId)=>{
        const actions = this.state.actions.slice();
        const prevItem =actions.splice(prevId,1)[0];
        actions.splice(nextId,0,prevItem);
        console.log("actions",actions)
        this.setState({actions})
    }

    renderOperationActions() {
        return(
            <div>
                <Typography variant="subheading" gutterBottom>{"Actions"}</Typography>
                {this.state.actions.map((action,index) => {
                    const split = action.split(":");
                    const actionItem = this.state.actionsRegistry.filter((action)=>{
                        return action.id == split[0];
                    })[0] || {};
                    return <Element key={index} index={index} onDropElement={this.onDropElement}>
                        <span>{actionItem.name + " ( " + actionItem.code + " ) "}</span>
                        <Remove onClick={() => {
                            let actions = [...this.state.actions];
                            actions.splice(index, 1);
                            this.setState({actions});
                        }}/>
                    </Element>
                })}
                <Button variant="raised" onClick={() => {
                    this.setState({openAddActionDialog: true});
                }}>Добавить действие</Button>
            </div>
        );
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
        return(
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
                    <Button variant="raised" onClick={() => {
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