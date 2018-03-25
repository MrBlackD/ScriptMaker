import {applyMiddleware, createStore} from "redux";
import reducer from "../reducers";
import thunk from "redux-thunk";
import logger from "../middlewares/logger";

const enhancer = applyMiddleware(thunk,logger)

const store = createStore(reducer,enhancer)
window.store = store
export default store