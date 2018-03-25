import {constants} from "../constants/constants";


export function loadDynamicParams() {
    return (dispatch) => {
        dispatch({
            type:constants.LOAD_DYNAMIC_PARAMS + constants.START
        })
        fetch(window.location.origin + "/api/dynamicParams").then((response) => {
            return response.json();
        }).then((response) => {
            dispatch({
                type:constants.LOAD_DYNAMIC_PARAMS + constants.SUCCESS,
                payload:{response}
            })
        }).catch(error=>{
            dispatch({
                type:constants.LOAD_DYNAMIC_PARAMS + constants.FAIL,
                payload:{error}
            })
        });
    }
}