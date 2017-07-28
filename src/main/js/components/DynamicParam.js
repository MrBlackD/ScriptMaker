import React, { Component } from 'react'
import {TableCell, TableRow} from "material-ui";


export default class DynamicParam extends Component {
    constructor(props){
        super(props);
    }

    renderRow(item){
        let result = [];
        for(let key in item){
            if(item.hasOwnProperty(key)){
                result.push(<TableCell key={key} className="cell">{""+item[key]}</TableCell>);
            }
        }
        return result;
    }

    render() {
        let param = this.props.data;
        return (
            <TableRow>{this.renderRow(param)}</TableRow>
        )
    }

}