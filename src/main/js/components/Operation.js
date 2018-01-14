import React, {Component} from "react";
import {Table, TableBody, TableCell, TableHead, TableRow} from "material-ui";


export default class Operation extends Component {
    constructor(props){
        super(props);

    }

    onParamOver(code){
        let elements = document.querySelectorAll("."+code);
        for(let key in elements){
            if(elements.hasOwnProperty(key)){
                elements[key].style.backgroundColor="#488bff";
            }

        }
    }

    onParamLeave(code){
        let elements = document.querySelectorAll("."+code);
        for(let key in elements){
            if(elements.hasOwnProperty(key)){
                elements[key].style.backgroundColor="";
            }

        }
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
                inParam = inParams[i];
            if(i < outParams.length)
                outParam = outParams[i];
            params.push(
                <TableRow key={i}>
                    <TableCell className={inParam.code} onMouseOver={()=>{this.onParamOver(inParam.code)}} onMouseLeave={()=>{this.onParamLeave(inParam.code)}}>{inParam.code}</TableCell>
                    <TableCell className={outParam.code} onMouseOver={()=>{this.onParamOver(outParam.code)}} onMouseLeave={()=>{this.onParamLeave(outParam.code)}}>{outParam.code}</TableCell>
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
                        <TableCell colSpan={2} classes={{head:"table-header-operation"}}  style={{"text-align":"center"}}>
                            {operation.name}
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
                        <TableCell colSpan={2}>{operation.description}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }

}
