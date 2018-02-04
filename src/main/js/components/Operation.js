import React, {Component} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableRow} from "material-ui";
import {Link} from "react-router";


export default class Operation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true
        };
    }

    getParams(operation) {
        let inParams = [];
        let outParams = [];
        if (operation.inParams && operation.inParams.length > 0)
            inParams = operation.inParams;
        if (operation.outParams && operation.outParams.length > 0)
            outParams = operation.outParams;
        let paramsLength = inParams.length > outParams.length ? inParams.length : outParams.length;
        let params = [];
        let className = "";
        for (let i = 0; i < paramsLength; i++) {
            let inParam = "";
            let outParam = "";
            if (i < inParams.length) {
                inParam = inParams[i].dynamicParam;
            }
            if (i < outParams.length) {
                outParam = outParams[i].dynamicParam;
            }

            if (this.props.context) {
                if (!this.props.context.includes(inParam.code)) {
                    className = "action-param__context-error";
                }
            }
            params.push(
                <TableRow key={i}>
                    <TableCell className={className}>{inParam.id}</TableCell>
                    <TableCell className={className}>{inParam.name}</TableCell>
                    <TableCell className={className}>{inParam.code}</TableCell>
                    <TableCell className={className}>{inParam.type}</TableCell>
                    <TableCell>{outParam.id}</TableCell>
                    <TableCell>{outParam.name}</TableCell>
                    <TableCell>{outParam.code}</TableCell>
                    <TableCell>{outParam.type}</TableCell>
                </TableRow>
            );
        }
        return {className,params};
    }


    render() {
        let operation = this.props.data;
        let collapsed = this.state.collapsed;
        console.log(operation);
        const {className,params} = this.getParams(operation);
        if (this.state.collapsed) {
            return (<div id={this.props.id} className={"ligh-blue text-center collapsed_table " + className}
                         onClick={() => {
                             this.setState({collapsed: !collapsed});
                         }}>{operation.name + "( code: " + operation.code + " )"}</div>)
        }
        return (
            <Table id={this.props.id} className="operation table">
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={8} className={"name " +className}
                                   onClick={() => {
                                       this.setState({collapsed: !collapsed});
                                   }}>
                            <Link
                                to={"/operations/" + operation.id}>{operation.name + "( code: " + operation.code + " )"}</Link>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell className="ligh-blue bold" colSpan={2}>Имя:</TableCell>
                        <TableCell colSpan={6}>{operation.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="ligh-blue bold" colSpan={2}>Код:</TableCell>
                        <TableCell colSpan={6}>{operation.code}</TableCell>
                    </TableRow>
                    <TableRow className="bold">
                        <TableCell className="ligh-blue bold text-center" colSpan={4}>Входящие параметры</TableCell>
                        <TableCell className="ligh-blue bold text-center" colSpan={4}>Исходящие параметры</TableCell>
                    </TableRow>
                    <TableRow className="bold">
                        <TableCell className="ligh-blue" colSpan={1}>ID</TableCell>
                        <TableCell className="ligh-blue" colSpan={1}>Имя</TableCell>
                        <TableCell className="ligh-blue" colSpan={1}>Код</TableCell>
                        <TableCell className="ligh-blue" colSpan={1}>Тип</TableCell>
                        <TableCell className="ligh-blue" colSpan={1}>ID</TableCell>
                        <TableCell className="ligh-blue" colSpan={1}>Имя</TableCell>
                        <TableCell className="ligh-blue" colSpan={1}>Код</TableCell>
                        <TableCell className="ligh-blue" colSpan={1}>Тип</TableCell>
                    </TableRow>
                    {params}
                    <TableRow>
                        <TableCell colSpan={8} className="ligh-blue bold text-center">
                            Описание
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={8}>{operation.description}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="text-center" colSpan={8}>
                            {this.props.onEdit &&
                            <Button raised={true}
                                    onClick={() => {
                                        this.props.onEdit(operation)
                                    }}>Редактировать</Button>}
                            {this.props.onDelete &&
                            <Button raised={true}
                                    onClick={() => {
                                        this.props.onDelete(operation.id)
                                    }}>Удалить</Button>}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }

}
