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
import {
    createDynamicParam,
    deleteDynamicParam,
    editDynamicParam,
    loadDynamicParams
} from "../AC/dynamicParamsActionCreators";
import {connect} from "react-redux";
import {selectDynamicParams} from "../selectors/dynamicParamsSelectors";


class DynamicParams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            targetId: 0,
            openDialog: false,
            deleteConfirmDialogOpened: false,
            editionDialogOpened: false,
            dynamicParam: {},
            filteredParams: [],
            newName: "",
            newCode: "",
            newType: "",
            editName: "",
            editCode: "",
            editType: "",
        };

        this.handleRequestCloseDialog = this.handleRequestCloseDialog.bind(this);
        this.handleRequestEditDialog = this.handleRequestEditDialog.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.props.loadDynamicParams();
    }

    handleCreateParam() {
        const {newName, newCode, newType} = this.state;
        this.props.createDynamicParam({name: newName, code: newCode, type: newType})
    }

    handleEditParam(id) {
        const {editName, editCode, editType} = this.state
        this.props.editDynamicParam({id, name: editName, code: editCode, type: editType})
    }

    handleDelete(id) {
        this.props.deleteDynamicParam(id)
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
        const param = this.props.dynamicParams.find((item)=>item.id==id)
        this.setState({
            editionDialogOpened: true,
            targetId: id,
            editCode: param.code,
            editName: param.name,
            editType: param.type
        });
    }


    renderParams(params) {
        return params.map((param, index) => <DynamicParam onClose={(id) => this.openDeleteDialog(param, id)}
                                                          onEdit={(id) => this.openEditDialog(id)}
                                                          key={index}
                                                          data={param}/>
        )
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
                    <Button onClick={() => this.setState({deleteConfirmDialogOpened: false})}
                            variant="raised">{"Отмена"}</Button>
                </DialogActions>
            </Dialog>
        );
    }

    renderCreationForm() {
        return (
            <div className={"dialog__content"}>
                <TextField value={this.state.newName}
                           onChange={(e) => this.setState({newName: e.target.value})}
                           label="Name"
                           required={true}/>
                <TextField value={this.state.newCode}
                           onChange={(e) => this.setState({newCode: e.target.value})}
                           label="Code"
                           required={true}/>
                <TextField value={this.state.newType}
                           onChange={(e) => this.setState({newType: e.target.value})}
                           label="Type"
                           required={true}/>
                <Button color="secondary" variant="raised" onClick={() => {
                    this.handleRequestCloseDialog();
                    this.handleCreateParam()
                }}>Create new</Button>
            </div>
        );
    }

    renderEditionForm() {
        const {dynamicParams} = this.props;

        let param;
        for (let i = 0; i < dynamicParams.length; i++) {
            if (dynamicParams[i].id === this.state.targetId) {
                param = dynamicParams[i];
                break;
            }
        }
        if (!param)
            return null;
        return (
            <div className={"dialog__content"}>
                <TextField value={this.state.editName}
                           onChange={(e) => this.setState({editName: e.target.value})}
                           label="Name"/>
                <TextField value={this.state.editCode}
                           onChange={(e) => this.setState({editCode: e.target.value})}
                           label="Code"/>
                <TextField value={this.state.editType}
                           onChange={(e) => this.setState({editType: e.target.value})}
                           label="Type"/>
                <Button color="secondary" variant="raised" onClick={() => {
                    this.handleRequestEditDialog();
                    this.handleEditParam(this.state.targetId)
                }}>Редактировать</Button>
            </div>
        );
    }

    render() {
        const {dynamicParams} = this.props;
        return (
            <Paper>
                <div style={{"textAlign": "center", "padding": "10px"}}>
                    <Button onClick={() => {
                        this.setState({openDialog: true});
                    }} variant="raised" color="secondary">Создать динамический параметр</Button>
                    <div>
                        <SearchField values={dynamicParams}
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
                        {this.renderHeader(dynamicParams)}
                    </TableHead>
                    <TableBody>
                        {this.renderParams(dynamicParams)}
                    </TableBody>
                </Table>
            </Paper>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        dynamicParams: selectDynamicParams(state)
    }
}

export default connect(mapStateToProps,
    {loadDynamicParams, createDynamicParam, deleteDynamicParam, editDynamicParam})(DynamicParams)