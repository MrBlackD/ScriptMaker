import React, {Component} from "react";
import {Button, Table, TableBody, TableCell, Typography, TableHead, TableRow} from "material-ui";


export default class Action extends Component {
    constructor(props){
        super(props);
        this.state = {
            collapsed: true
        };
    }
    render() {
        let action = this.props.data;
        let onClose = this.props.onClose;
        let onEdit = this.props.onEdit;
        let collapsed = this.state.collapsed;

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
                    <TableCell className={inParam.id}>{inParam.id}</TableCell>
                    <TableCell className={inParam.name}>{inParam.name}</TableCell>
                    <TableCell className={inParam.code}>{inParam.code}</TableCell>
                    <TableCell className={inParam.type}>{inParam.type}</TableCell>
                    <TableCell className={outParam.id}>{outParam.id}</TableCell>
                    <TableCell className={outParam.name}>{outParam.name}</TableCell>
                    <TableCell className={outParam.code}>{outParam.code}</TableCell>
                    <TableCell className={outParam.type}>{outParam.type}</TableCell>
                </TableRow>
            );
        }
        if(this.state.collapsed){
            return (<div id={this.props.id} className="yellow text-center collapsed_table"
                         onClick={() =>{
                             this.setState({collapsed: !collapsed});
                         }}>{action.name +"( code: "+action.code+" )"}</div>)
        }

        return (
            <Table id={this.props.id} className="action table">
                <TableHead>
                    <TableRow>
                        <TableCell className="name" colSpan={8}
                                onClick={() =>{
                                    this.setState({collapsed: !collapsed});
                                }}>
                            {action.name +"( code: "+action.code+" )"}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell className="yellow bold" colSpan={2}>Имя:</TableCell>
                        <TableCell colSpan={6}>{action.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="yellow bold" colSpan={2}>Код:</TableCell>
                        <TableCell colSpan={6}>{action.code}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="yellow bold" colSpan={2}>Модуль:</TableCell>
                        <TableCell colSpan={6}>{action.module}</TableCell>
                    </TableRow>
                    <TableRow className="bold">
                        <TableCell className="yellow text-center" colSpan={4}>Входящие параметры</TableCell>
                        <TableCell className="yellow text-center" colSpan={4}>Исходящие параметры</TableCell>
                    </TableRow>
                    <TableRow className="bold">
                        <TableCell className="yellow" colSpan={1}>ID параметра</TableCell>
                        <TableCell className="yellow" colSpan={1}>Имя параметра</TableCell>
                        <TableCell className="yellow" colSpan={1}>Код параметра</TableCell>
                        <TableCell className="yellow" colSpan={1}>Модуль параметра</TableCell>
                        <TableCell className="yellow" colSpan={1}>ID параметра</TableCell>
                        <TableCell className="yellow" colSpan={1}>Имя параметра</TableCell>
                        <TableCell className="yellow" colSpan={1}>Код параметра</TableCell>
                        <TableCell className="yellow" colSpan={1}>Модуль параметра</TableCell>
                    </TableRow>
                    {params}
                    <TableRow>
                        <TableCell colSpan={8}  className="yellow bold text-center">
                            Описание
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={8}>
                            {action.description}</TableCell>
                    </TableRow>
                    {this.props.mapping&&
                    <TableRow className="bold">
                        <TableCell className="text-center yellow" colSpan={8}>IN MAPPING</TableCell>
                    </TableRow>
                    }
                    {this.props.mapping&&
                    <TableRow className="bold yellow">
                        <TableCell colSpan={4}>FROM</TableCell>
                        <TableCell colSpan={4}>TO</TableCell>
                    </TableRow>}
                    {this.props.mapping&&this.props.mapping.map((item)=>{
                        if(item.type === "IN"){
                            return (
                                <TableRow>
                                    <TableCell colSpan={4}>{item.in}</TableCell>
                                    <TableCell colSpan={4}>{item.out}</TableCell>
                                </TableRow>
                            )
                        }
                    })}
                    {this.props.mapping&&
                    <TableRow className="bold">
                        <TableCell className="text-center yellow" colSpan={8}>OUT MAPPING</TableCell>
                    </TableRow>
                    }
                    {this.props.mapping&&
                    <TableRow className="bold yellow">
                        <TableCell colSpan={4}>FROM</TableCell>
                        <TableCell colSpan={4}>TO</TableCell>
                    </TableRow>}
                    {this.props.mapping&&this.props.mapping.map((item)=>{
                        if(item.type === "OUT"){
                            return (
                                <TableRow>
                                    <TableCell colSpan={4}>{item.in}</TableCell>
                                    <TableCell colSpan={4}>{item.out}</TableCell>
                                </TableRow>
                            )
                        }
                    })}

                    <TableRow>
                        <TableCell className="text-center" colSpan={8}>
                            {this.props.onEdit&&<Button raised={true} onClick={()=>{this.props.onEdit(action)}}>Редактировать</Button>}
                            {this.props.onDelete&&<Button raised={true} onClick={()=>{this.props.onDelete(action.id)}}>Удалить</Button>}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        )
    }

}