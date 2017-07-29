import React, { Component } from 'react'
import {TableCell, TableRow} from "material-ui";
import {Delete, Edit} from "material-ui-icons";

export default class DynamicParam extends Component {
    constructor(props){
        super(props);
    }

    renderRow(item){
        let result = [];
        let onClose = this.props.onClose;
        let onEdit = this.props.onEdit;
        for(let key in item){
            if(item.hasOwnProperty(key)){
                result.push(<TableCell key={key} className="cell">{""+item[key]}</TableCell>);
            }
        }
        result.push(<TableCell key={item.length} className="cell"><Edit onClick={()=>onEdit(item["id"])} className="icon-edit"/></TableCell>);
        result.push(<TableCell key={item.length + 1} className="cell"><Delete onClick={()=>onClose(item["id"])} className="icon-delete"/></TableCell>);
        return result;
    }

    render() {
        let param = this.props.data;
        return (
            <TableRow>{this.renderRow(param)}</TableRow>
        )
    }

}