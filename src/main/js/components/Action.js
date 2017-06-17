import React, { Component } from 'react'


export default class Action extends Component {
    constructor(props){
        super(props);

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
                <tr key={i}>
                    <td>{inParam.code}</td>
                    <td>{outParam.code}</td>
                </tr>
            );
        }
        return (
            <table className="action">
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