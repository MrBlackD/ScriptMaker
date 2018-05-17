import {createSelector} from "reselect";

export const selectDynamicParams = (state) => state.dynamicParams.entities.toArray()