import React from "react";
import Params from "../Params";

class ParamsTable extends React.Component{

    render(){
        const {params, dynamicParams, onRemoveClick, paramsType} = this.props;
        const resultParams = params.map((param) => {
            const parametr = param;
            const paramInst = dynamicParams.find((param) => param.id == parametr.id);
            return {
                id: paramInst.id,
                code: paramInst.code,
                name: paramInst.name,
                required: parametr.required,
                keepInWorkflow: parametr.keepInWorkflow,
                defaultValue: parametr.defaultValue,
            }
        });
        return <Params params={resultParams} onRemoveClick={(param) => onRemoveClick(param, paramsType)}/>
    }
}
ParamsTable.propTypes = {}

export default ParamsTable;