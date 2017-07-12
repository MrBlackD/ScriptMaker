import React, { Component } from 'react'


export default class Node extends Component {
    constructor(props){
        super(props);

    }


    render() {
        return (<div id={this.props.id} style={{"left":this.props.x+"px","top":this.props.y+"px"}} className="node">{this.props.data.name}</div>)
    }

}