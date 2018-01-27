import React from "react";
import PropTypes from 'prop-types';
import {TextField} from "material-ui";

export default class SearchField extends React.Component {
    render() {
        return (
            <TextField onChange={(e) => {
                let currentSearchValue = e.target.value.toLowerCase();
                let result = this.props.values.slice().filter((value) => {
                    let item = value;
                    if(this.props.field){
                        item = value[this.props.field];
                    }
                    return item && item.toLowerCase().includes(currentSearchValue);
                });
                this.props.onChange(result);
            }}
                       label="Search"/>)
    }
}

SearchField.propTypes = {
    values: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    field: PropTypes.string
}