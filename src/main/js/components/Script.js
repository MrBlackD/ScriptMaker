import React, { Component } from 'react';
import Node from "./Node";
require('jsplumb');

export default class Script extends Component {
    constructor(props){
        super(props);
        this.state={
            nodes:props.nodes,
            script: {
                node: {},
                nextNode: {}
            }
        };
        jsPlumb.bind("connection",function(info){
            console.log("CONNECTED");
            console.log(info);
        });
        jsPlumb.bind("connectionDetached",function(info){
            console.log("DETACHED");
            console.log(info);
        });
        jsPlumb.bind("connectionMoved",function(info){
            console.log("CONNECTION MOVED");
            console.log(info);
        });
    }

    componentDidMount() {
        this.makeNodesDraggable();
    }

    componentDidUpdate(){
        this.addNode()
    }

    addNode(){
        let nodes = this.props.nodes;
        let item = nodes[nodes.length - 1];
        console.log(this.state.nodes);
        let id = item.timestamp;
        jsPlumb.draggable(""+id,{anchor:"AutoDefault",containment:true});
        jsPlumb.makeTarget(""+id, {
            isTarget:true,
            anchor:[ "Perimeter", { shape:"Square", anchorCount:150 }],
            paintStyle:{ fill:"#ccc" },
        });
        jsPlumb.addEndpoint(""+id, {
            connectorOverlays:[
                [ "Arrow", { width:10, length:10, location:0.5, id:"arrow" } ],
                [ "Label", { label:item.condition?"-":"", id:"label",location:0,cssClass:"condition_label" } ]
            ],
            isSource: true,
            paintStyle: {fill: "#46c7e0"},
            anchor:["Perimeter", {shape:"Square", faces:[ "left" ] } ]
        });
        if(item.condition){
            jsPlumb.addEndpoint(""+id, {
                connectorOverlays:[
                    [ "Arrow", { width:10, length:10, location:0.5, id:"arrow" } ],
                    [ "Label", { label:"+", id:"label",location:0,cssClass:"condition_label" } ]
                ],
                isSource: true,
                paintStyle: {fill: "#46c7e0"},
                anchor:["Perimeter", {shape:"Square", faces:[ "left" ] } ]
            });
        }

    }

    makeNodesDraggable(){

        let nodes = this.props.nodes;
        jsPlumb.draggable("startOperation",{anchor:"AutoDefault",containment:true});
        jsPlumb.addEndpoint("startOperation",{
            connectorOverlays:[
                [ "Arrow", { width:10, length:10, location:0.5, id:"arrow" } ]
            ],
            isSource:true,
            paintStyle:{ fill:"#46c7e0" },
            anchor:[ "Perimeter", { shape:"Square", anchorCount:150 }]
        });
        jsPlumb.draggable("endOperation",{anchor:"AutoDefault",containment:true});
        jsPlumb.makeTarget("endOperation", {
            isTarget:true,
            anchor:[ "Perimeter", { shape:"Square", anchorCount:150 }],
            paintStyle:{ fill:"#ccc" },
        });

    }

    componentWillUnmount() {
        jsPlumb.deleteEveryEndpoint();
    }

    renderScript(){
        let nodes = this.props.nodes;
        let result = [];

        result.push(<Node  plumb={jsPlumb} key={"startOperation"} id={"startOperation"} x={100} y={100} data={"Operation Start"}/>);
        {nodes.map((item)=>{
            if(item.condition){
                result.push(<Node  plumb={jsPlumb} key={item.timestamp} id={item.timestamp} x={20} y={20} type={"condition"} data={item.condition}/>);
            } else {
                result.push(<Node  plumb={jsPlumb} key={item.timestamp} id={item.timestamp} x={item.id*20} y={item.id*20} data={item}/>);
            }

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