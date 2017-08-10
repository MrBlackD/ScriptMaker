import React, { Component } from 'react';
import Node from "./Node";
require('jsplumb');

export default class Script extends Component {
    constructor(props){
        super(props);

    }

    componentDidMount() {
        this.makeNodesDraggable();
    }

    componentDidUpdate(){
        this.makeNodesDraggable();
    }

    makeNodesDraggable(){
        jsPlumb.setContainer("operationScript");
        let nodes = this.props.nodes;
        //jsPlumb.draggable("startOperation",{anchor:"AutoDefault",containment:true});
        jsPlumb.draggable("endOperation",{anchor:"AutoDefault",containment:true});

        {nodes.map((item)=>{
            return(
                jsPlumb.draggable(""+item.id,{anchor:"AutoDefault",containment:true})
            )
        })}
        jsPlumb.makeSource("startOperation", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            paintStyle:{ fill:"gray" }
        });
    }

    componentWillUnmount() {
        jsPlumb.deleteEveryEndpoint();
    }

    createNode(item){
        return (<Node  plumb={jsPlumb} key={item.id} id={item.id} x={item.id*20} y={item.id*20} data={item}/>);
    }

    renderScript(){
        let nodes = this.props.nodes;
        jsPlumb.setContainer("operationScript");
        let result = [];

        result.push(<Node  plumb={jsPlumb} key={"startOperation"} id={"startOperation"} x={100} y={100} data={"Operation Start"}/>);
        {nodes.map((item)=>{
            result.push(<Node  plumb={jsPlumb} key={item.id} id={item.id} x={item.id*20} y={item.id*20} data={item}/>);
        })}
        result.push(<Node  plumb={jsPlumb} key={"endOperation"} id={"endOperation"} x={300} y={300} data={"Operation End"}/>);
        return result;
    }
    render() {
        return (
            <div className="operationScript">
                {this.renderScript()}
            </div>
        );
    }

}