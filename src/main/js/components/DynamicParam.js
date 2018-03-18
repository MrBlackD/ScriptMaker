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
        return [
            <TableCell key={item.id + "name" + item.name} className="cell">{item.name}</TableCell>,
            <TableCell key={item.id + "code" + item.code} className="cell">{item.code}</TableCell>,
            <TableCell key={item.id + "type" + item.type} className="cell">{item.type}</TableCell>,
            <TableCell key={item.id + "edit"} className="cell">
                <Edit onClick={() => onEdit(item["id"])} className="icon-edit"/>
            </TableCell>,
            <TableCell key={item.id + "delete"} className="cell">
                <Delete onClick={() => onClose(item["id"])} className="icon-delete"/>
            </TableCell>
        ];
    }

    render() {
        let param = this.props.data;
        return (
            <TableRow>{this.renderRow(param)}</TableRow>
        )
    }

}