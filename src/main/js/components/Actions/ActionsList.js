import React from "react";
import PropTypes from "prop-types";
import Action from "../Action";

class ActionsList extends React.Component {

    render() {
        const {actions, onEdit, onDelete} = this.props;
        return (
            <div>
                {actions.map((item) => <Action onDelete={(id) => onDelete(id)}
                                                  onEdit={(action) => onEdit(action)}
                                                  key={item.id} data={item}/>)}
            </div>
        );
    }
}
ActionsList.propTypes = {
    actions: PropTypes.array,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
}

export default ActionsList;