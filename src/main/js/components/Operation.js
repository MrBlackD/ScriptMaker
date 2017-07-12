import React, { Component } from 'react'
import {Link} from "react-router";


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
                <tr key={i}>
                    <td className={inParam.code} onMouseOver={()=>{this.onParamOver(inParam.code)}} onMouseLeave={()=>{this.onParamLeave(inParam.code)}}>{inParam.code}</td>
                    <td className={outParam.code} onMouseOver={()=>{this.onParamOver(outParam.code)}} onMouseLeave={()=>{this.onParamLeave(outParam.code)}}>{outParam.code}</td>
                </tr>
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
            <table id={this.props.id} className="operation">
                <tbody>
                <tr>
                    <td colSpan={2}><Link to={"/operationScript/"+operation.id}>{operation.name}</Link></td>
                </tr>
                <tr>
                    <td colSpan={2}>{operation.code}</td>
                </tr>
                <tr>
                    <td>входящие параметры</td>
                    <td>исходящие параметры</td>
                </tr>
                {this.getParams(operation)}
                <tr>
                    <td colSpan={2}>{operation.description}</td>
                </tr>
                </tbody>
            </table>
        );
    }

}