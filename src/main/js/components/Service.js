import React, {Component} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableRow} from "material-ui";
import {Link} from "react-router";


export default class Service extends Component {
    constructor(props){
        super(props);

    }

    getParams(service){
        let inParams = [];
        let outParams = [];
        if(service.inParams&&service.inParams.length > 0)
            inParams = service.inParams;
        if(service.outParams&&service.outParams.length > 0)
            outParams = service.outParams;
        let paramsLength = inParams.length > outParams.length ? inParams.length : outParams.length;
        let params = [];
        for(let i=0;i < paramsLength; i++){
            let inParam = "";
            let outParam = "";
            if(i < inParams.length)
                inParam = inParams[i];
            if(i < outParams.length)
                outParam = outParams[i];
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

        let service = this.props.data;
        if(this.props.collapsed){
            return (<div id={this.props.id} className="node">{service.name}</div>)
        }
        return (
            <Table id={this.props.id} className="service" >
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={2} classes={{head:"table-header-operation"}}  className={"name"}>
                            <Link to={"/services/"+service.id}>{service.name}</Link>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={2}>{service.code}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>входящие параметры</TableCell>
                        <TableCell>исходящие параметры</TableCell>
                    </TableRow>
                    {this.getParams(service)}
                    <TableRow>
                        <TableCell colSpan={2} classes={{head:"table-header-operation"}}  style={{"text-align":"center"}}>
                            Описание
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>{service.description}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style={{"textAlign":"center"}} colSpan={2}>
                            {this.props.onEdit&&
                            <Button raised={true}
                                    onClick={()=>{this.props.onEdit(service.id)}}>Редактировать</Button>}
                            {this.props.onDelete&&
                            <Button raised={true}
                                    onClick={()=>{this.props.onDelete(service.id)}}>Удалить</Button>}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }

}