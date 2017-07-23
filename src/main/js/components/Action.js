import React, { Component } from 'react'
import "./style.css"

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
                <tr key={i}>
                    <td className={inParam.code} onMouseOver={()=>{this.onParamOver(inParam.code)}} onMouseLeave={()=>{this.onParamLeave(inParam.code)}}>{inParam.code}</td>
                    <td className={outParam.code} onMouseOver={()=>{this.onParamOver(outParam.code)}} onMouseLeave={()=>{this.onParamLeave(outParam.code)}}>{outParam.code}</td>
                </tr>
            );
        }
        if(this.props.collapsed){
            return (<div id={this.props.id} style={{"left":this.props.x+"px","top":this.props.y+"px"}} className="node">{action.name}</div>)
        }

        return (
            <table id={this.props.id} className="action">
                <tbody>
                    <tr>
                        <td colSpan={2}>{action.name}</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{action.code}</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{action.module}</td>
                    </tr>
                    <tr>
                        <td>входящие параметры</td>
                        <td>исходящие параметры</td>
                    </tr>
                    {params}
                    <tr>
                        <td colSpan={2}>{action.description}</td>
                    </tr>
                </tbody>
            </table>
        )
    }

}