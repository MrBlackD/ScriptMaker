import React, {Component} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableRow} from "material-ui";
import InvisibleTableCell from "./InvisibleTableCell";


export default class Action extends Component {
    constructor(props){
        super(props);
        this.state = {
            collapsed: true
        };
    }
    render() {
        let action = this.props.data;
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

            let inMapping = this.props.mapping&&this.props.mapping.filter((mapping)=>{
                return mapping.type.includes("IN") && mapping.out === inParam.code;
            })[0] || {};

            let outMapping = this.props.mapping&&this.props.mapping.filter((mapping)=>{
                    return mapping.type.includes("OUT") && mapping.in === outParam.code;
                })[0] || {};

            params.push(
                <TableRow key={i}>
                    {this.props.mapping&&<TableCell >{inMapping.in}</TableCell>}
                    <TableCell className={inParam.id}>{inParam.id}</TableCell>
                    <TableCell className={inParam.name}>{inParam.name}</TableCell>
                    <TableCell className={inParam.code}>{inParam.code}</TableCell>
                    <TableCell className={inParam.type}>{inParam.type}</TableCell>
                    <TableCell className={outParam.id}>{outParam.id}</TableCell>
                    <TableCell className={outParam.name}>{outParam.name}</TableCell>
                    <TableCell className={outParam.code}>{outParam.code}</TableCell>
                    <TableCell className={outParam.type}>{outParam.type}</TableCell>
                    {this.props.mapping&&<TableCell >{outMapping.out}</TableCell>}
                </TableRow>
            );
        }
        if(this.state.collapsed){
            return (<div id={this.props.id} className="yellow text-center collapsed_table name"
                         onClick={() =>{
                             this.setState({collapsed: !collapsed});
                         }}>{action.name +"( code: "+action.code+" )"}</div>)
        }
        if(this.props.mapping){
            return (
                <Table id={this.props.id} className="action table">
                    <TableHead>
                        <TableRow>
                            <InvisibleTableCell/>
                            <TableCell className="name" colSpan={8}
                                       onClick={() => {
                                           this.setState({collapsed: !collapsed});
                                       }}>
                                {action.name + "( code: " + action.code + " )"}
                            </TableCell>
                            <InvisibleTableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <InvisibleTableCell/>
                            <TableCell className="yellow bold" colSpan={2}>Имя:</TableCell>
                            <TableCell colSpan={6}>{action.name}</TableCell>
                            <InvisibleTableCell/>
                        </TableRow>
                        <TableRow>
                            <InvisibleTableCell/>
                            <TableCell className="yellow bold" colSpan={2}>Код:</TableCell>
                            <TableCell colSpan={6}>{action.code}</TableCell>
                            <InvisibleTableCell/>
                        </TableRow>
                        <TableRow>
                            <InvisibleTableCell/>
                            <TableCell className="yellow bold" colSpan={2}>Модуль:</TableCell>
                            <TableCell colSpan={6}>{action.module}</TableCell>
                            <InvisibleTableCell/>
                        </TableRow>
                        <TableRow className="bold">
                            <InvisibleTableCell/>
                            <TableCell className="yellow text-center" colSpan={4}>Входящие параметры</TableCell>
                            <TableCell className="yellow text-center" colSpan={4}>Исходящие параметры</TableCell>
                            <InvisibleTableCell/>
                        </TableRow>
                        <TableRow className="bold">
                            <TableCell colSpan={1} className="yellow">Входящий маппинг</TableCell>
                            <TableCell className="yellow" colSpan={1}>ID</TableCell>
                            <TableCell className="yellow" colSpan={1}>Имя</TableCell>
                            <TableCell className="yellow" colSpan={1}>Код</TableCell>
                            <TableCell className="yellow" colSpan={1}>Тип</TableCell>
                            <TableCell className="yellow" colSpan={1}>ID</TableCell>
                            <TableCell className="yellow" colSpan={1}>Имя</TableCell>
                            <TableCell className="yellow" colSpan={1}>Код</TableCell>
                            <TableCell className="yellow" colSpan={1}>Тип</TableCell>
                            <TableCell colSpan={1} className="yellow">Исходящий маппинг</TableCell>
                        </TableRow>
                        {params}
                        <TableRow>
                            <InvisibleTableCell/>
                            <TableCell colSpan={8} className="yellow bold text-center">
                                Описание
                            </TableCell>
                            <InvisibleTableCell/>
                        </TableRow>
                        <TableRow>
                            <InvisibleTableCell/>
                            <TableCell colSpan={8}>{action.description}</TableCell>
                            <InvisibleTableCell/>
                        </TableRow>
                        <TableRow>
                            <InvisibleTableCell/>
                            <TableCell className="text-center" colSpan={8}>
                                {this.props.onEdit && <Button raised={true} onClick={() => {
                                    this.props.onEdit(action)
                                }}>Редактировать</Button>}
                                {this.props.onDelete && <Button raised={true} onClick={() => {
                                    this.props.onDelete(action.id)
                                }}>Удалить</Button>}
                            </TableCell>
                            <InvisibleTableCell/>
                        </TableRow>
                    </TableBody>
                </Table>
            )
        } else {
            return (
                <Table id={this.props.id} className="action table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="name" colSpan={8}
                                       onClick={() => {
                                           this.setState({collapsed: !collapsed});
                                       }}>
                                {action.name + "( code: " + action.code + " )"}
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
                            <TableCell className="yellow" colSpan={1}>ID</TableCell>
                            <TableCell className="yellow" colSpan={1}>Имя</TableCell>
                            <TableCell className="yellow" colSpan={1}>Код</TableCell>
                            <TableCell className="yellow" colSpan={1}>Тип</TableCell>
                            <TableCell className="yellow" colSpan={1}>ID</TableCell>
                            <TableCell className="yellow" colSpan={1}>Имя</TableCell>
                            <TableCell className="yellow" colSpan={1}>Код</TableCell>
                            <TableCell className="yellow" colSpan={1}>Тип</TableCell>
                        </TableRow>
                        {params}
                        <TableRow>
                            <TableCell colSpan={8} className="yellow bold text-center">
                                Описание
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={8}>
                                {action.description}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center" colSpan={8}>
                                {this.props.onEdit && <Button raised={true} onClick={() => {
                                    this.props.onEdit(action)
                                }}>Редактировать</Button>}
                                {this.props.onDelete && <Button raised={true} onClick={() => {
                                    this.props.onDelete(action.id)
                                }}>Удалить</Button>}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            )
        }
    }

}