import React, { Component } from 'react';
import Node from "./Node";
require('jsplumb');

export default class Container extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {

        this.drawConnections();
    }

    componentWillUnmount() {
        let plumb = jsPlumb;
        plumb.deleteEveryEndpoint();
    }


    drawConnections(){
        let plumb = jsPlumb;
        plumb.setContainer("operationScript");
        let node = this.props.data;
        this.connect(node);
        jsPlumb.draggable("endOperation",{anchor:"AutoDefault",containment:true});
    }

    connect(node){
        if(!node)
            return;
        if(node.startNode){
            jsPlumb.draggable("startOperation",{anchor:"AutoDefault",containment:true});
            jsPlumb.connect({
                source:startOperation,
                target:""+node.code,
                anchor:"Continuous",
                endpoints:["Rectangle", "Dot"],
                endpointStyles:[
                    { fill: "#9d9d9d",outlineStroke:"black", outlineWidth:1},
                    { fill: "#ccc",outlineStroke:"black", outlineWidth:1,radius:10 }
                ],
                connector:["Bezier",{curviness:50}],
                paintStyle:{ stroke:"#5fccc5", strokeWidth:1 },
                deleteEndpointsOnDetach:false,
                detachable:false,
                overlays:["Arrow"]
            });
            jsPlumb.draggable(node.code,{anchor:"AutoDefault",containment:true});
            jsPlumb.connect({
                source:node.code,
                target:""+node.startNode.id,
                anchor:"Continuous",
                endpoints:["Rectangle", "Dot"],
                endpointStyles:[
                    { fill: "#9d9d9d",outlineStroke:"black", outlineWidth:1},
                    { fill: "#ccc",outlineStroke:"black", outlineWidth:1,radius:10 }
                ],
                connector:["Bezier",{curviness:50}],
                paintStyle:{ stroke:"#5fccc5", strokeWidth:1 },
                deleteEndpointsOnDetach:false,
                detachable:false,
                overlays:["Arrow"]
            });
            this.connect(node.startNode);
            return;
        }
        jsPlumb.draggable(""+node.id,{anchor:"AutoDefault",containment:true});
        if(!node.condition){
            if(node.nextNode){
                jsPlumb.connect({
                    source:""+node.id,
                    target:""+node.nextNode.id,
                    anchor:"Continuous",
                    endpoints:["Rectangle", "Dot"],
                    endpointStyle:{ fill: "#ccc",outlineStroke:"black", outlineWidth:1 },
                    connector:["Bezier",{curviness:50}],
                    paintStyle:{ stroke:"#5fccc5", strokeWidth:1 },
                    deleteEndpointsOnDetach:false,
                    detachable:false,
                    overlays:["Arrow"]
                });
                this.connect(node.nextNode);
            } else {
                jsPlumb.connect({
                    source:""+node.id,
                    target:"endOperation",
                    anchor:"Continuous",
                    endpoints:["Rectangle", "Dot"],
                    endpointStyle:{ fill: "#ccc",outlineStroke:"black", outlineWidth:1 },
                    connector:["Bezier",{curviness:50}],
                    paintStyle:{ stroke:"#5fccc5", strokeWidth:1 },
                    deleteEndpointsOnDetach:false,
                    detachable:false,
                    overlays:["Arrow"]
                });
            }

        } else {
            if(node.condition.isTrueNode){
                jsPlumb.connect({
                    source:""+node.id,
                    target:""+node.condition.isTrueNode.id,
                    anchor:"Continuous",
                    endpoints:["Rectangle", "Dot"],
                    endpointStyle:{ fill: "#ccc",outlineStroke:"black", outlineWidth:1 },
                    connector:["Bezier",{curviness:50}],
                    paintStyle:{ stroke:"#5fccc5", strokeWidth:1 },
                    deleteEndpointsOnDetach:false,
                    detachable:false,
                    overlays:["Arrow"]
                });
                this.connect(node.condition.isTrueNode);
            } else {
                jsPlumb.connect({
                    source:""+node.id,
                    target:"endOperation",
                    anchor:"Continuous",
                    endpoints:["Rectangle", "Dot"],
                    endpointStyle:{ fill: "#ccc",outlineStroke:"black", outlineWidth:1 },
                    connector:["Bezier",{curviness:50}],
                    paintStyle:{ stroke:"#5fccc5", strokeWidth:1 },
                    deleteEndpointsOnDetach:false,
                    detachable:false,
                    overlays:["Arrow"]
                });
            }

            if(node.condition.isFalseNode){
                jsPlumb.connect({
                    source:""+node.id,
                    target:""+node.condition.isFalseNode.id,
                    anchor:"Continuous",
                    endpoints:["Rectangle", "Dot"],
                    endpointStyle:{ fill: "#ccc",outlineStroke:"black", outlineWidth:1 },
                    connector:["Bezier",{curviness:50}],
                    paintStyle:{ stroke:"#5fccc5", strokeWidth:1 },
                    deleteEndpointsOnDetach:false,
                    detachable:false,
                    overlays:["Arrow"]
                });
                this.connect(node.condition.isFalseNode);
            } else {
                jsPlumb.connect({
                    source:""+node.id,
                    target:"endOperation",
                    anchor:"Continuous",
                    endpoints:["Rectangle", "Dot"],
                    endpointStyle:{ fill: "#ccc",outlineStroke:"black", outlineWidth:1 },
                    connector:["Bezier",{curviness:50}],
                    paintStyle:{ stroke:"#5fccc5", strokeWidth:1 },
                    deleteEndpointsOnDetach:false,
                    detachable:false,
                    overlays:["Arrow"]
                });
            }

        }
    }

    renderScript(operation) {
        let plumb=jsPlumb;
        plumb.setContainer("operationScript");
        let res = [];
        this.renderNodes(operation,res);
        res.push(<Node  plumb={jsPlumb} key={"endOperation"} id={"endOperation"} x={300} y={300} data={"Operation End"}/>);
        return res;
    }

    renderNodes(node,result){
        if(!node)
            return;
        if(node.startNode){
            result.push(<Node  plumb={jsPlumb} key={"startOperation"} id={"startOperation"} x={0} y={0} data={"Operation Start"}/>);
            result.push(<Node  plumb={jsPlumb} key={node.code} id={node.code} x={10} y={10} data={node}/>);
            this.renderNodes(node.startNode,result);
            return;
        }
        result.push(<Node plumb={jsPlumb} key={node.id} id={node.id} x={node.x} y={node.y} data={node.action}/>);
        if(!node.condition){
            this.renderNodes(node.nextNode,result);
        } else {
            this.renderNodes(node.condition.isTrueNode,result);
            this.renderNodes(node.condition.isFalseNode,result);
        }

    }

    render() {
        return (
            <div className="operationScript">
                {this.renderScript(this.props.data)}
            </div>
        );
    }

}