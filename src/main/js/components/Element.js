import React from "react";
import {DragSource, DropTarget} from "react-dnd";
import {ItemTypes} from "../constants/constants";

class Element extends React.Component{


    render(){
        const { connectDragSource, connectDropTarget,isDragging } = this.props;
        return connectDropTarget(connectDragSource(
            <div className="draggableElement" style={{opacity:isDragging?0:1}}>{this.props.children}</div>
        ))
    }
}



const elementSource = {
    beginDrag(props) {
        return {
            index:props.index
        };
    }
};

const elementTarget = {
    drop(props, monitor) {
        console.log("props",props)
        console.log(monitor.getItem())
        props.onDropElement(props.index,monitor.getItem().index);
    }
};

const dragCollect =(connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}
const dropCollect = connect => ({
    connectDropTarget: connect.dropTarget(),
})

export default DropTarget(ItemTypes.ELEMENT,elementTarget,dropCollect)
(DragSource(ItemTypes.ELEMENT,elementSource,dragCollect)(Element));