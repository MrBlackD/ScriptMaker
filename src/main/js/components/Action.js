import React, { Component } from 'react'
import './../../css/style.css'
import {Table, TableBody, TableCell, TableHead, TableRow} from "material-ui";

export default class Action extends Component {
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

    render() {
        let action = this.props.data;
        if(!action)
            return null;
        console.log(action);
        let inParams = [];
        let outParams = [];
        if(action.inParams&&action.inParams.length > 0)
            inParams = action.inParams;
        if(action.outParams&&action.outParams.length > 0)
            outParams = action.outParams;
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
        if(this.props.collapsed){
            return (<div id={this.props.id} style={{"left":this.props.x+"px","top":this.props.y+"px"}} className="node">{action.name}</div>)
        }

        return (
            <Table id={this.props.id} className="action">
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={2} style={{"textAlign":"center"}}>{action.name}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={2}>{action.code}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>{action.module}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>входящие параметры</TableCell>
                        <TableCell>исходящие параметры</TableCell>
                    </TableRow>
                    {params}
                    <TableRow>
                        <TableCell colSpan={2}>{action.description}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        )
    }

}