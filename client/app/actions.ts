import { App, exchangeStoreData, exchangeStoresTax } from "./app";
import { Operation, assign } from "./../utils/functions";
import axios from "axios";

export enum appActionsName {
    INIT_APP = "INIT_APP",

    FETCH_EXCHANGE_STORES_TAX_DATA = "FETCH_EXCHANGE_STORES_TAX_DATA",
    FETCH_EXCHANGE_STORES_TAX_DATA_SUCCEEDED = "FETCH_EXCHANGE_STORES_TAX_DATA_SUCCEEDED",
    FETCH_EXCHANGE_STORES_POINTS_ARRAY = "FETCH_EXCHANGE_STORES_POINTS_ARRAY",
    FETCH_EXCHANGE_STORES_POINTS_ARRAY_SUCCEEDED = "FETCH_EXCHANGE_STORES_POINTS_ARRAY_SUCCEEDED",
    CHANGE_INVEST_VALUE = "CHANGE_INVEST_VALUE",
    UPDATE_APPLICATION = "UPDATE_APPLICATION"
}

export class upDateApplication implements Operation {
    public type: string = appActionsName.UPDATE_APPLICATION;

    constructor(public payload: boolean) {}

    process({ getState, action }, dispatch, done) {
        //dispatch(new fetchExchangeStoresPointsArray(action.payload));
        setInterval(() => {
            dispatch(new fetchExchangeStoresPointsArray("?"));
        }, 15000);
    }
}

export class fetchExchangeStoresPointsArray implements Operation {
    public type: string = appActionsName.FETCH_EXCHANGE_STORES_POINTS_ARRAY;

    constructor(public payload: string) {}

    public Reduce(state: App): App {
        if (this.payload == "?") return state;
        return assign(state, { period: this.payload });
    }

    process({ getState, action }, dispatch, done) {
        console.log(action.payload, action.payload == "?");
        const period = action.payload == "?" ? getState().app.period : action.payload;
        const exchangeStores = ["foxbit", "flowbtc", "mercado", "braziliex", "negocieCoins"];
        for (let key in exchangeStores) {
            axios("/server/getData?exchange=" + exchangeStores[key] + "&period=" + period)
                .then(resp => dispatch(new fetchExchangeStoresPointsArraySucceeded(resp.data)))
                .catch(err => {
                    console.error(err); // log since could be render err
                });
            if (parseInt(key) == exchangeStores.length) done();
        }
    }
}

export class fetchExchangeStoresPointsArraySucceeded implements Operation {
    public type: string = appActionsName.FETCH_EXCHANGE_STORES_POINTS_ARRAY_SUCCEEDED;

    constructor(public payload: exchangeStoreData) {}

    public Reduce(state: App): App {
        for (let i = 0; i < state.exchangeStoresPointsArray.length; i++) {
            const currentArray = state.exchangeStoresPointsArray[i];
            if (currentArray.name == this.payload.name) {
                return assign(state, {
                    exchangeStoresPointsArray: [
                        ...state.exchangeStoresPointsArray.slice(0, i),
                        this.payload,
                        ...state.exchangeStoresPointsArray.slice(i + 1, state.exchangeStoresPointsArray.length - 1)
                    ]
                });
            }
        }
        return assign(state, { exchangeStoresPointsArray: [...state.exchangeStoresPointsArray, this.payload] });
    }
}

export class fetchExchangeStoresTaxData implements Operation {
    public type: string = appActionsName.FETCH_EXCHANGE_STORES_TAX_DATA;

    process({ getState, action }, dispatch, done) {
        axios("/server/getExchangesData")
            .then(resp => dispatch(new fetchExchangeStoresTaxDataSucceeded(resp.data)))
            .catch(err => {
                console.error(err); // log since could be render err
            });
    }
}

export class fetchExchangeStoresTaxDataSucceeded implements Operation {
    public type: string = appActionsName.FETCH_EXCHANGE_STORES_TAX_DATA_SUCCEEDED;

    constructor(public payload: exchangeStoresTax) {}

    public Reduce(state: App): App {
        return assign(state, { exchangeStoresTax: this.payload });
    }
}

export class changeInvestValue implements Operation {
    public type: string = appActionsName.CHANGE_INVEST_VALUE;

    constructor(public payload: string) {}

    public Reduce(state: App): App {
        return assign(state, { investValue: this.payload });
    }
}

export const appActions = {
    upDateApplication,
    fetchExchangeStoresPointsArray,
    fetchExchangeStoresPointsArraySucceeded,
    fetchExchangeStoresTaxData,
    fetchExchangeStoresTaxDataSucceeded,
    changeInvestValue
};
