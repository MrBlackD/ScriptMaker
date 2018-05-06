import React from "react";
import PropTypes from "prop-types";

class Fix extends React.Component{

    render(){
        return (<li>[*] - {this.props.children}</li>);
    }
}
Fix.propTypes = {
    children: PropTypes.string
}

export default Fix;