import React, {Component} from "react";
import "fetch-polyfill";
import DynamicParam from "./DynamicParam";
import {Link} from "react-router";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "material-ui";
import SearchField from "./SearchField";
import {loadDynamicParams} from "../AC/index";
import {connect} from "react-redux";


class DynamicParams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            targetId: 0,
            openDialog: false,
            deleteConfirmDialogOpened: false,
            editionDialogOpened: false,
            dynamicParam: {},
            dynamicParams: [],
            filteredParams: []
        };

        this.handleRequestCloseDialog = this.handleRequestCloseDialog.bind(this);
        this.handleRequestEditDialog = this.handleRequestEditDialog.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        fetch(window.location.origin + "/api/dynamicParams").then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            this.setState({
                dynamicParams: json,
                filteredParams: json
            });
        });
        this.props.loadDynamicParams();

    }

    handleCreateParam() {
        let name = this.newName.value;
        this.newName.value = "";
        let code = this.newCode.value;
        this.newCode.value = "";
        let type = this.newType.value;
        this.newType.value = "";
        console.log(name + " " + code + " " + type );

        let url = window.location.origin + "/api/dynamicParams/new?"
                + "name=" + name
                + "&code=" + code
                + "&type=" + type

        fetch(url).then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            this.loadData();
        });

    }

    handleEditParam(id) {
        let name = this.editName.value;
        this.editName.value = "";
        let code = this.editCode.value;
        this.editCode.value = "";
        let type = this.editType.value;
        this.editType.value = "";

        console.log(id + "" + name + " " + code + " " + type );
        let url = window.location.origin + "/api/dynamicParams/edit?"
            + "id=" + id;
        if (name) {
            url += "&name=" + name;
        }
        if (code) {
            url += "&code=" + code;
        }
        if (type) {
            url += "&type=" + type;
        }
        fetch(url).then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            this.loadData();
        });


    }

    handleDelete(id) {
        let url = window.location.origin + "/api/dynamicParams/delete?id=" + id;
        fetch(url).then((response) => {
            console.log(response);
            this.loadData();
        });

    }

    handleRequestCloseDialog() {
        this.setState({openDialog: false});
    }

    handleRequestEditDialog() {
        this.setState({editionDialogOpened: false});
    }

    renderHeader() {
        return (<TableRow>
            <TableCell>{"NAME"}</TableCell>
            <TableCell>{"CODE"}</TableCell>
            <TableCell>{"TYPE"}</TableCell>
            <TableCell>{"EDIT"}</TableCell>
            <TableCell>{"DELETE"}</TableCell>
        </TableRow>);
    }

    openDeleteDialog(param, id) {
        this.setState({deleteConfirmDialogOpened: true, dynamicParam: param, targetId: id});
    }

    openEditDialog(id) {
        this.setState({editionDialogOpened: true, targetId: id});
    }


    renderParams(params) {
        console.log("params",params);
        return params.map((param,index)=>{
           return <DynamicParam onClose={(id) => this.openDeleteDialog(param, id)}
                          onEdit={(id) => this.openEditDialog(id)}
                          key={index}
                          data={param}/>
        })

    }

    renderRow(item) {
        let result = [];
        for (let key in item) {
            if (item.hasOwnProperty(key)) {
                result.push(<td className="cell">{"" + item[key]}</td>);
            }
        }
        return (
            <tr>
                {result}
            </tr>
        );
    }

    renderCreationDialog() {
        return (
            <Dialog classes={{paper: "dialog"}} open={this.state.openDialog} onClose={this.handleRequestCloseDialog}>
                <DialogTitle>
                    <Typography variant="headline" gutterBottom>{"Создание динамического параметра"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root: "content"}}>
                    {this.renderCreationForm()}
                </DialogContent>
            </Dialog>
        );
    }

    renderEditionDialog() {
        return (
            <Dialog classes={{paper: "dialog"}} open={this.state.editionDialogOpened}
                    onClose={this.handleRequestEditDialog}>
                <DialogTitle>
                    <Typography variant="headline" gutterBottom>{"Редактирование динамического параметра"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root: "content"}}>
                    {this.renderEditionForm()}
                </DialogContent>
            </Dialog>
        );
    }

    openRefers() {
        return (
            <div>
                <div style={{color: 'red'}}>{"Имеются ссылки:"}</div>
                {this.state.dynamicParam.refersServices && this.openRefersServices()}
                {this.state.dynamicParam.refersOperations && this.openRefersOperations()}
                {this.state.dynamicParam.refersActions && this.openRefersActions()}
            </div>
        )
    }

    openRefersActions() {
        return (
            <div>
                <div>{"Actions:"}</div>
                <div>
                    {
                        this.state.dynamicParam.refersActions.split(",").map((element) => {
                            return (
                                <div>
                                    <Button>
                                        <Link className="react-router-link"
                                              to={"/actions/" + element}>{"id: " + element}</Link>
                                    </Button>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    openRefersOperations() {
        return (
            <div>
                <div>{"Operations:"}</div>
                <div>
                    {
                        this.state.dynamicParam.refersOperations.split(",").map((element) => {
                            return (
                                <div>
                                    <Button>
                                        <Link className="react-router-link"
                                              to={"/operations/" + element}>{"id: " + element}</Link>
                                    </Button>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    openRefersServices() {
        return (
            <div>
                <div>{"Services:"}</div>
                <div>
                    {
                        this.state.dynamicParam.refersServices.split(",").map((element) => {
                            return (
                                <div>
                                    <Button>
                                        <Link className="react-router-link"
                                              to={"/services/" + element}>{"id: " + element}</Link>
                                    </Button>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    renderDeleteConfirmDialog() {
        return (
            <Dialog open={this.state.deleteConfirmDialogOpened}>
                <DialogTitle>
                    {"Удаление"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {"Удалить динамический параметр ?"}
                    </DialogContentText>
                    <DialogContentText>
                        {this.state.dynamicParam.refersActions ||
                        this.state.dynamicParam.refersOperations ||
                        this.state.dynamicParam.refersServices ? this.openRefers() : ""}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        this.setState({deleteConfirmDialogOpened: false});
                        this.handleDelete(this.state.targetId)
                    }
                    } color="secondary" variant="raised">{"Удалить"}</Button>
                    <Button onClick={() => this.setState({deleteConfirmDialogOpened: false})} variant="raised">{"Отмена"}</Button>
                </DialogActions>
            </Dialog>
        );
    }

    renderCreationForm() {
        return (
            <div className={"dialog__content"}>
                <TextField id="newName" inputRef={(input) => {
                    this.newName = input;
                }} label="Name" required={true}/>
                <TextField id="newCode" inputRef={(input) => {
                    this.newCode = input;
                }} label="Code" required={true}/>
                <TextField id="newType" inputRef={(input) => {
                    this.newType = input;
                }} label="Type" required={true}/>

                <Button color="secondary" variant="raised" onClick={() => {
                    this.handleRequestCloseDialog();
                    this.handleCreateParam()
                }}>Create new</Button>
            </div>
        );
    }

    renderEditionForm() {
        let params = this.state.dynamicParams;
        let param;
        for (let i = 0; i < params.length; i++) {
            if (params[i].id === this.state.targetId) {
                param = params[i];
                break;
            }
        }
        if (!param)
            return null;
        return (
            <div className={"dialog__content"}>
                <TextField id="editName" inputRef={(input) => {
                    this.editName = input;
                }} defaultValue={param.name} label="Name"/>
                <TextField id="editCode" inputRef={(input) => {
                    this.editCode = input;
                }} defaultValue={param.code} label="Code"/>
                <TextField id="editType" inputRef={(input) => {
                    this.editType = input;
                }} defaultValue={param.type} label="Type"/>
                <Button color="secondary" variant="raised" onClick={() => {
                    this.handleRequestEditDialog();
                    this.handleEditParam(this.state.targetId)
                }}>Редактировать</Button>
            </div>
        );
    }

    render() {
        let params = this.state.filteredParams;
        return (
            <Paper>
                <div style={{"textAlign": "center", "padding": "10px"}}>
                    <Button onClick={() => {
                        this.setState({openDialog: true});
                    }} variant="raised" color="secondary">Создать динамический параметр</Button>
                    <div>
                        <SearchField values={this.state.dynamicParams}
                                     field="code"
                                     onChange={(value) => {
                                         this.setState({filteredParams: value})
                                     }}
                        />
                    </div>
                </div>

                {this.renderCreationDialog()}
                {this.renderEditionDialog()}
                {this.renderDeleteConfirmDialog()}
                <Table>
                    <TableHead>
                        {this.renderHeader(params)}
                    </TableHead>
                    <TableBody>
                        {this.renderParams(params)}
                    </TableBody>
                </Table>
            </Paper>
        )
    }

}

export default connect(null,{loadDynamicParams})(DynamicParams)