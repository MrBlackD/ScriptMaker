import React from "react";
import PropTypes from "prop-types";

class Version extends React.Component{

    render(){
        return (
            <div>
                <h1>{this.props.version} - Changelog</h1>
                <ul>{this.props.children}</ul>
            </div>
        );
    }
}
Version.propTypes = {
    children: PropTypes.array,
    version: PropTypes.string
}

export default Version;