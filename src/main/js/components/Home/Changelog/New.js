import React from "react";
import PropTypes from "prop-types";

class New extends React.Component{

    render(){
        return (<li>[+] - {this.props.children}</li>);
    }
}
New.propTypes = {
    children: PropTypes.string
}

export default New;