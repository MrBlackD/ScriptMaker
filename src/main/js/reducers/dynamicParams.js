import {constants} from "../constants/constants";
const initState = {
    dynamicParams:[]
}

export default (state = initState,action) => {
    const {type,payload} = action
    switch (type){
        case constants.LOAD_DYNAMIC_PARAMS + constants.SUCCESS:
            return state = payload.response
        default:
            return state;
    }

}