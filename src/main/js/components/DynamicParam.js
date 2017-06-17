import React, { Component } from 'react'


export default class DynamicParam extends Component {
    constructor(props){
        super(props);
    }

    renderRow(item){
        let result = [];
        for(let key in item){
            if(item.hasOwnProperty(key)){
                result.push(<td key={key} className="cell">{""+item[key]}</td>);
            }
        }
        return result;
    }

    render() {
        let param = this.props.data;
        return (
            <tr>{this.renderRow(param)}</tr>
        )
    }

}