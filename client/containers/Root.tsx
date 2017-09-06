import * as React from "react";
import * as ReactDOM from "react-dom";
import { Store } from "redux";

import { Provider, ProviderProps } from "react-redux";
import { Router, browserHistory } from "react-router";
import routes from "../routes";
import { rootReducer } from "../reducers/index";
import configureStore from "../store/configureStore";
import { DevTools } from "./DevTools";
import IntlContainer from "./intlConTainer";

const env = process.env.NODE_ENV;
const initialState = {};

const { store, history } = configureStore(initialState);

// sagaMiddleware.run(rootSaga);

const applyDevTools = () => {
    if (env === "development") {
        return (
            <div>
                <DevTools />
                <div className="hide-child">
                </div>
            </div>
        );
    } else {
        return <span />;
    }
};

export const router = history;

export class Root extends React.Component<any, any> {
    render() {
        return (
            <Provider store={store}>
                <IntlContainer>
                    <div>
                        {routes(history)}
                        {applyDevTools()}
                    </div>
                </IntlContainer>
            </Provider>
        );
    }
}
