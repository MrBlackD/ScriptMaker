import React, {Component} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableRow} from "material-ui";
import {Link} from "react-router";


export default class Service extends Component {
    constructor(props){
        super(props);
        this.state = {
            collapsed: true
        };
    }

    getParams(service){
        let inParams = [];
        let outParams = [];
        if(service.inParams&&service.inParams.length > 0){
            inParams = service.inParams;
        }
        if(service.outParams&&service.outParams.length > 0){
            outParams = service.outParams;
        }
        let paramsLength = inParams.length > outParams.length ? inParams.length : outParams.length;
        let params = [];
        for(let i=0;i < paramsLength; i++){
            let inParam = "";
            let outParam = "";
            if(i < inParams.length)
                inParam = inParams[i].dynamicParam;
            if(i < outParams.length)
                outParam = outParams[i].dynamicParam;
            params.push(
                <TableRow key={i}>
                    <TableCell>{inParam.id}</TableCell>
                    <TableCell>{inParam.name}</TableCell>
                    <TableCell>{inParam.code}</TableCell>
                    <TableCell>{inParam.type}</TableCell>
                    <TableCell>{outParam.id}</TableCell>
                    <TableCell>{outParam.name}</TableCell>
                    <TableCell>{outParam.code}</TableCell>
                    <TableCell>{outParam.type}</TableCell>
                </TableRow>
            );
        }
        return params;
    }


    render() {
        let collapsed = this.state.collapsed;
        let service = this.props.data;
        if(this.state.collapsed){
            return (<div id={this.props.id} className="gray text-center collapsed_table"
                         onClick={() =>{
                             this.setState({collapsed: !collapsed});
                         }}>{service.name +"( code: "+service.code+" )"}</div>)
        }
        return (
            <Table id={this.props.id} className="service table" >
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={8}  className={"name"}
                                   onClick={() =>{
                                       this.setState({collapsed: !collapsed});
                                   }}>
                            <Link to={"/services/"+service.id}>{service.name+"( code: "+service.code+" )"}</Link>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell className="gray bold" colSpan={2}>Имя:</TableCell>
                        <TableCell colSpan={6}>{service.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="gray bold" colSpan={2}>Код:</TableCell>
                        <TableCell colSpan={6}>{service.code}</TableCell>
                    </TableRow>
                    <TableRow className="bold">
                        <TableCell className="gray" colSpan={4}>Входящие параметры</TableCell>
                        <TableCell className="gray" colSpan={4}>Исходящие параметры</TableCell>
                    </TableRow>
                    <TableRow className="bold">
                        <TableCell className="gray" colSpan={1}>ID</TableCell>
                        <TableCell className="gray" colSpan={1}>Имя</TableCell>
                        <TableCell className="gray" colSpan={1}>Код</TableCell>
                        <TableCell className="gray" colSpan={1}>Тип</TableCell>
                        <TableCell className="gray" colSpan={1}>ID</TableCell>
                        <TableCell className="gray" colSpan={1}>Имя</TableCell>
                        <TableCell className="gray" colSpan={1}>Код</TableCell>
                        <TableCell className="gray" colSpan={1}>Тип</TableCell>
                    </TableRow>
                    {this.getParams(service)}
                    <TableRow>
                        <TableCell colSpan={8} className="gray bold text-center">
                            Описание
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={8}>{service.description}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="text-center" colSpan={8}>
                            {this.props.onEdit&&
                            <Button variant="raised"
                                    onClick={()=>{this.props.onEdit(service)}}>Редактировать</Button>}
                            {this.props.onDelete&&
                            <Button variant="raised"
                                    onClick={()=>{this.props.onDelete(service.id)}}>Удалить</Button>}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }

}
