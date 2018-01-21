import React, {Component} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableRow} from "material-ui";


export default class Action extends Component {
    constructor(props){
        super(props);
    }

    render() {
        let action = this.props.data;
        let onClose = this.props.onClose;
        let onEdit = this.props.onEdit;

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
            if(i < inParams.length){
                inParam = inParams[i].dynamicParam;
            }
            if(i < outParams.length){
                outParam = outParams[i].dynamicParam;
            }

            params.push(
                <TableRow key={i}>
                    <TableCell className={inParam.code}>{inParam.code}</TableCell>
                    <TableCell className={outParam.code}>{outParam.code}</TableCell>
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
                        <TableCell className="name" colSpan={2} >
                            {action.name +"( id:"+action.id+")"}
                        </TableCell>
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
                        <TableCell colSpan={2}  style={{"text-align":"center"}}>
                            Описание
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>{action.description}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style={{"textAlign":"center"}} colSpan={2}>
                            {this.props.onEdit&&<Button raised={true} onClick={()=>{this.props.onEdit(action)}}>Редактировать</Button>}
                            {this.props.onDelete&&<Button raised={true} onClick={()=>{this.props.onDelete(action.id)}}>Удалить</Button>}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        )
    }

}