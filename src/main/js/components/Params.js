import React from "react";
import PropTypes from "prop-types";
import {Table, TableBody, TableCell, TableHead, TableRow} from "material-ui";
import {Remove} from "material-ui-icons";

export default class Params extends React.Component{

    render(){
        const {params, onRemoveClick} = this.props;
        if(params.length === 0){
            return null;
        }
        return(
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Code</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>DefaultValue</TableCell>
                        <TableCell>Required</TableCell>
                        <TableCell>KeepInWorkflow</TableCell>
                        <TableCell>Remove</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        params.map((param) => {
                            return <TableRow key={param.id}>
                                <TableCell>{param.code}</TableCell>
                                <TableCell>{param.name}</TableCell>
                                <TableCell>{param.defaultValue}</TableCell>
                                <TableCell>{param.required}</TableCell>
                                <TableCell>{param.keepInWorkflow}</TableCell>
                                <TableCell>
                                    <Remove onClick={()=>{onRemoveClick(param)}}/>
                                </TableCell>
                            </TableRow>;
                        })
                    }
                </TableBody>
            </Table>
        );
    }
}

Params.propTypes ={
    params:PropTypes.array.isRequired,
    onRemoveClick:PropTypes.func
}