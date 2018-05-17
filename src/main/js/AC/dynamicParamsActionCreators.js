import {constants, FAIL, START, SUCCESS} from "../constants/constants";


export function loadDynamicParams() {
    return (dispatch) => {
        dispatch({
            type: constants.LOAD_DYNAMIC_PARAMS + START
        })
        fetch(window.location.origin + "/api/dynamicParams").then((response) => {
            return response.json();
        }).then((response) => {
            dispatch({
                type: constants.LOAD_DYNAMIC_PARAMS + SUCCESS,
                payload: {response}
            })
        }).catch(error => {
            dispatch({
                type: constants.LOAD_DYNAMIC_PARAMS + FAIL,
                payload: {error}
            })
        });
    }
}

export const createDynamicParam = ({name, code, type}) => (dispatch) => {

    dispatch({
        type: constants.CREATE_DYNAMIC_PARAM + START
    })
    let url = window.location.origin + "/api/dynamicParams/new?"
        + "name=" + encodeURIComponent(name)
        + "&code=" + encodeURIComponent(code)
        + "&type=" + encodeURIComponent(type)

    fetch(url).then((response) => {
        return response.json();
    }).then((json) => {
        console.log(json);
        dispatch({
            type: constants.CREATE_DYNAMIC_PARAM + SUCCESS,
            payload: {response: json}
        })
        dispatch(loadDynamicParams());
    }).catch((error) => {
        console.error(error)
        dispatch({
            type: constants.CREATE_DYNAMIC_PARAM + FAIL,
            payload: {error}
        })
    });
}

export const deleteDynamicParam = (id) => (dispatch) => {
    dispatch({
        type: constants.DELETE_DYNAMIC_PARAM + START
    })
    let url = window.location.origin + "/api/dynamicParams/delete?id=" + encodeURIComponent(id);
    fetch(url).then((response) => {
        console.log(response);
        dispatch({
            type: constants.DELETE_DYNAMIC_PARAM + SUCCESS,
            payload: {response}
        })
        dispatch(loadDynamicParams());
    }).catch((error) => {
        dispatch({
            type: constants.DELETE_DYNAMIC_PARAM + FAIL,
            payload: {error}
        })
    });

}

export const editDynamicParam = ({id, name, code, type}) => (dispatch) => {

    dispatch({
        type: constants.EDIT_DYNAMIC_PARAM + START
    })
    console.log(id + "" + name + " " + code + " " + type);
    let url = window.location.origin + "/api/dynamicParams/edit?"
        + "id=" + encodeURIComponent(id);
    if (name) {
        url += "&name=" + encodeURIComponent(name);
    }
    if (code) {
        url += "&code=" + encodeURIComponent(code);
    }
    if (type) {
        url += "&type=" + encodeURIComponent(type);
    }
    fetch(url).then((response) => {
        return response.json();
    }).then((json) => {
        console.log(json);
        dispatch({
            type: constants.EDIT_DYNAMIC_PARAM + SUCCESS,
            payload: {response: json}
        })
        dispatch(loadDynamicParams());
    }).catch((error) => {
        dispatch({
            type: constants.EDIT_DYNAMIC_PARAM + FAIL,
            payload: {error}
        })
    });


}