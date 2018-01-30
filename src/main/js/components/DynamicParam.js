import React, {Component} from "react";
import {TableCell, TableRow} from "material-ui";
import {Delete, Edit} from "material-ui-icons";

export default class DynamicParam extends Component {
    constructor(props) {
        super(props);
    }

    renderRow(item) {

        let onClose = this.props.onClose;
        let onEdit = this.props.onEdit;
        const fields = ["id","name","code","type"];
        let result = fields.map((field,index)=>{
            return <TableCell key={index} className="cell">{item[field]}</TableCell>
        })
        result.push(
            <TableCell key={item.length} className="cell">
                <Edit onClick={() => onEdit(item["id"])} className="icon-edit"/>
            </TableCell>);
        result.push(
            <TableCell key={item.length + 1} className="cell">
                <Delete onClick={() => onClose(item["id"])} className="icon-delete"/>
            </TableCell>);
        return result;
    }

    render() {
        let param = this.props.data;
        return (
            <TableRow>{this.renderRow(param)}</TableRow>
        )
    }

}