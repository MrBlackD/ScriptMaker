import React, {Component} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableRow} from "material-ui";
import {Link} from "react-router";


export default class Operation extends Component {
    constructor(props){
        super(props);

    }

    getParams(operation){
        let inParams = [];
        let outParams = [];
        if(operation.inParams&&operation.inParams.length > 0)
            inParams = operation.inParams;
        if(operation.outParams&&operation.outParams.length > 0)
            outParams = operation.outParams;
        let paramsLength = inParams.length > outParams.length ? inParams.length : outParams.length;
        let params = [];
        for(let i=0;i < paramsLength; i++){
            let inParam = "";
            let outParam = "";
            if(i < inParams.length)
                inParam = inParams[i].dynamicParam;
            if(i < outParams.length)
                outParam = outParams[i].dynamicParam;
            params.push(
                <TableRow key={i}>
                    <TableCell className={inParam.code}>{inParam.code}</TableCell>
                    <TableCell className={outParam.code}>{outParam.code}</TableCell>
                </TableRow>
            );
        }
        return params;
    }


    render() {
        let operation = this.props.data;
        if(this.props.collapsed){
            return (<div id={this.props.id} className="node">{operation.name}</div>)
        }
        return (
            <Table id={this.props.id} className="operation" >
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={2}  className={"name"}>
                            <Link to={"/operations/"+operation.id}>{operation.name+"( id:"+operation.id+")"}</Link>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={2}>{operation.code}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>входящие параметры</TableCell>
                        <TableCell>исходящие параметры</TableCell>
                    </TableRow>
                    {this.getParams(operation)}
                    <TableRow>
                        <TableCell colSpan={2}  style={{"text-align":"center"}}>
                            Описание
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>{operation.description}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style={{"textAlign":"center"}} colSpan={2}>
                            {this.props.onEdit&&
                            <Button raised={true}
                                    onClick={()=>{this.props.onEdit(operation)}}>Редактировать</Button>}
                            {this.props.onDelete&&
                            <Button raised={true}
                                    onClick={()=>{this.props.onDelete(operation.id)}}>Удалить</Button>}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }

}
