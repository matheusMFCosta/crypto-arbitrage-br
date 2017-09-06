import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { appReducer } from "./../app/reducers";

export const rootReducer = combineReducers({
    routing: routerReducer,
    app: appReducer
});

import { App } from "./../app/app";

export interface appStateTypings {
    routing: any;
    app: App;
}
