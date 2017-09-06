import { createStore, applyMiddleware, compose } from "redux";
import { rootReducer } from "../reducers/index";
import { DevTools } from "../containers/DevTools";

import { syncHistoryWithStore } from "react-router-redux";
import { useRouterHistory } from "react-router";
import { createHashHistory } from "history";
import { createLogicMiddleware } from "redux-logic";

import { logicActions } from "./../reducers/logic";

declare const module: IHotModule;

interface IHotModule {
    hot?: { accept: (path: string, callback: () => void) => void };
}

const logicMiddleware = createLogicMiddleware(logicActions, {});
export default function configureStore(initialState) {
    const enhancer = compose(applyMiddleware(logicMiddleware), DevTools.instrument());
    const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });
    const store = createStore(rootReducer, initialState, enhancer);
    const history = syncHistoryWithStore(appHistory, store);
    if (module.hot) {
        module.hot.accept("./../reducers", () => store.replaceReducer(require("./../reducers")));
    }
    return { store, history };
}
