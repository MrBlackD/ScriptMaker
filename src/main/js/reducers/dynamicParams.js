import {constants, SUCCESS} from "../constants/constants";
import {List, Record} from "immutable";

const InitState = Record({
    entities: new List([])
})

export default (state = new InitState(), action) => {
    const {type, payload} = action
    switch (type) {
        case constants.LOAD_DYNAMIC_PARAMS + SUCCESS:
            return state.set("entities", new List(payload.response))
        default:
            return state;
    }

}