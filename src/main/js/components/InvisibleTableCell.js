import React from "react";
import {TableCell} from "material-ui";

export default class InvisibleTableCell extends React.Component{
    render(){
        return (<TableCell className={"invisible"} colSpan={1}/>);
    }
}