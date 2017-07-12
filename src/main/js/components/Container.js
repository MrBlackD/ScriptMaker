import React, { Component } from 'react'
import Node from "./Node";


export default class Container extends Component {
    constructor(props){
        super(props);

    }

    componentDidMount() {
        let plumb = jsPlumb;
        plumb.draggable("node",{anchor:"AutoDefault"});

        plumb.setContainer("operationScript");
        for(let i=100;i<110;i++){
            plumb.draggable(""+i,{anchor:"AutoDefault"});
            plumb.connect({
                source:""+i,
                target:""+(i+1),
                anchors:["Right", "Left" ],
                endpoint:"Rectangle",
                endpointStyle:{ fill: "yellow" }
            });
        }

    }

    renderScript(operation) {
        let plumb=jsPlumb;
        plumb.setContainer("operationScript");
        let res = [];
        let index = 1;
        let prevNode={x:10,y:10};
        console.log(operation);
        let node = operation;
        let ind=100;

        while(node){
            if(index===1){
                res.push(<Node  plumb={plumb} key={index++} id={ind++} x={prevNode.x} y={prevNode.y} data={node}/>);
                prevNode = node;
                node = node.startNode;
                continue;
            }
            if(!node.condition){
                res.push(<Node plumb={plumb} key={index++} id={ind++} x={node.x} y={node.y} data={node.action}/>);
            }
            prevNode = node;
            node = node.nextNode;
        }

        return res;
    }

    render() {
        return (
            <div className="operationScript">
                {this.renderScript(this.props.data)}
            </div>
        );
    }

}