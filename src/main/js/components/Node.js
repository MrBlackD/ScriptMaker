import React, { Component } from 'react'


export default class Node extends Component {
    constructor(props){
        super(props);

    }


    render() {
        let name;
        if(this.props.id==="startOperation"||this.props.id==="endOperation"||this.props.type==="condition"){
            name = this.props.data;
        } else {
            name = this.props.data.name;
        }
        let className = "node";
        if(this.props.type==="condition"){
            className += " condition";
        }

        return (<div id={this.props.id} style={{"left":this.props.x+"px","top":this.props.y+"px"}} className={className}>{name}</div>)
    }

}