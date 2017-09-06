import { App, exchangeStoreData } from "./app";
import { Operation, assign } from "./../utils/functions";
import axios from "axios";

export enum appActionsName {
    INIT_APP = "INIT_APP",
    FETCH_EXCHANGE_STORES_DATA = "FETCH_EXCHANGE_STORES_DATA",
    FETCH_EXCHANGE_STORES_DATA_SUCCEEDED = "FETCH_EXCHANGE_STORES_DATA_SUCCEEDED"
}

export class appInit implements Operation {
    public type: string = appActionsName.INIT_APP;

    constructor(public payload: boolean) {}

    //validate() {}

    public Reduce(state: App): App {
        return assign(state, { init: this.payload });
    }
}

export class fetchExchangeStoresData implements Operation {
    public type: string = appActionsName.FETCH_EXCHANGE_STORES_DATA;

    process({ getState, action }, dispatch, done) {
        const exchangeStores = ["foxbit", "flowbtc", "mercado"];
        for (let key in exchangeStores) {
            axios("https://localhost.com/server/getData?exchange=" + exchangeStores[key])
                .then(resp => (console.log("sadasd"), dispatch(new fetchExchangeStoresDataSucceeded(exchangeStores[key], resp.data))))
                .catch(err => {
                    console.error(err); // log since could be render err
                });
            if (key == "3") done();
        }
    }
}

export class fetchExchangeStoresDataSucceeded implements Operation {
    public type: string = appActionsName.FETCH_EXCHANGE_STORES_DATA_SUCCEEDED;
    public payload;
    constructor(name: string, dataPoints: exchangeStoreData) {
        this.payload = { name: name, dataPoints: dataPoints };
        console.log("--");
    }

    public Reduce(state: App): App {
        console.log("!!!", [...state.exchangeStoresData, this.payload]);
        return assign(state, { exchangeStoresData: [...state.exchangeStoresData, this.payload] });
    }
}
export const appActions = {
    appInit,
    fetchExchangeStoresData,
    fetchExchangeStoresDataSucceeded
};
