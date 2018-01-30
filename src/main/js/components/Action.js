import React, {Component} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableRow} from "material-ui";


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
                        <TableCell className="name" colSpan={2}
                                onClick={() =>{
                                    this.setState({collapsed: !collapsed});
                                }}>
                            {action.name +"( id:"+action.id+")"}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className={collapsed ? "collapsed" : ""}>
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
                    {this.props.mapping&&
                    <TableRow>
                        <TableCell colSpan={2}>IN MAPPING</TableCell>
                    </TableRow>
                    }
                    {this.props.mapping&&
                    <TableRow>
                        <TableCell>FROM</TableCell>
                        <TableCell>TO</TableCell>
                    </TableRow>}
                    {this.props.mapping&&this.props.mapping.map((item)=>{
                        if(item.type === "IN"){
                            return (
                                <TableRow>
                                    <TableCell>{item.in}</TableCell>
                                    <TableCell>{item.out}</TableCell>
                                </TableRow>
                            )
                        }
                    })}
                    {this.props.mapping&&
                    <TableRow>
                        <TableCell colSpan={2}>OUT MAPPING</TableCell>
                    </TableRow>
                    }
                    {this.props.mapping&&
                    <TableRow>
                        <TableCell>FROM</TableCell>
                        <TableCell>TO</TableCell>
                    </TableRow>}
                    {this.props.mapping&&this.props.mapping.map((item)=>{
                        if(item.type === "OUT"){
                            return (
                                <TableRow>
                                    <TableCell>{item.in}</TableCell>
                                    <TableCell>{item.out}</TableCell>
                                </TableRow>
                            )
                        }
                    })}

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