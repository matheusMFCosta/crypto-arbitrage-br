var { filterActions } = require("redux-ignore");
import { App } from "./app";
import { appActionsName } from "./actions";
import { Operation } from "./../utils/functions";

const multifactorInitialState: App = {
    init: false,
    exchangeStoresPointsArray: [],
    exchangeStoresTax: [],
    investValue: "1000",
    period: "1h"
};

export const appReducerNoFilter = (state: App = multifactorInitialState, action: Operation) => {
    if (action.Reduce) {
        return action.Reduce(state);
    }
    return state;
};

export const appReducer = filterActions(appReducerNoFilter, Object.keys(appActionsName));
