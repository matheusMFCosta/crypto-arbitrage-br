import { App, exchangeStoreData, exchangeStoresTax } from "./app";
import { Operation, assign } from "./../utils/functions";
import axios from "axios";

export enum appActionsName {
    INIT_APP = "INIT_APP",

    FETCH_EXCHANGE_STORES_TAX_DATA = "FETCH_EXCHANGE_STORES_TAX_DATA",
    FETCH_EXCHANGE_STORES_TAX_DATA_SUCCEEDED = "FETCH_EXCHANGE_STORES_TAX_DATA_SUCCEEDED",
    FETCH_EXCHANGE_STORES_POINTS_ARRAY = "FETCH_EXCHANGE_STORES_POINTS_ARRAY",
    FETCH_EXCHANGE_STORES_POINTS_ARRAY_SUCCEEDED = "FETCH_EXCHANGE_STORES_POINTS_ARRAY_SUCCEEDED",
    CHANGE_INVEST_VALUE = "CHANGE_INVEST_VALUE"
}

export class appInit implements Operation {
    public type: string = appActionsName.INIT_APP;

    constructor(public payload: boolean) {}

    public Reduce(state: App): App {
        return assign(state, { init: this.payload });
    }
}

export class fetchExchangeStoresPointsArray implements Operation {
    public type: string = appActionsName.FETCH_EXCHANGE_STORES_POINTS_ARRAY;

    constructor(public payload: string) {}

    public Reduce(state: App): App {
        return assign(state, { exchangeStoresPointsArray: [] });
    }

    process({ getState, action }, dispatch, done) {
        const exchangeStores = ["foxbit", "flowbtc", "mercado"];
        for (let key in exchangeStores) {
            axios("https://localhost.com/server/getData?exchange=" + exchangeStores[key] + "&period=" + action.payload)
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
        return assign(state, { exchangeStoresPointsArray: [...state.exchangeStoresPointsArray, this.payload] });
    }
}

export class fetchExchangeStoresTaxData implements Operation {
    public type: string = appActionsName.FETCH_EXCHANGE_STORES_TAX_DATA;

    process({ getState, action }, dispatch, done) {
        axios("https://localhost.com/server/getExchangesData")
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
    appInit,
    fetchExchangeStoresPointsArray,
    fetchExchangeStoresPointsArraySucceeded,
    fetchExchangeStoresTaxData,
    fetchExchangeStoresTaxDataSucceeded,
    changeInvestValue
};
