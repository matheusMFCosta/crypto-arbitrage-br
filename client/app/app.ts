export interface App {
    init: boolean;
    exchangeStoresPointsArray: exchangeStoresPointsArray;
    exchangeStoresTax: exchangeStoresTax;
    investValue: string;
    period: string;
}

export type exchangeStoresPointsArray = Array<exchangeStoreData>;
export type exchangeStoreData = { name: string; pointsArray: Array<[number, number, number]> };

export type exchangeStoresTax = Array<exchangeStoreTax>;
export interface exchangeStoreTax {
    name: string;
    realDeposit: Array<taxPrice>;
    bitDeposit: Array<taxPrice>;
    realWithDraw: Array<taxPrice>;
    bitWithDraw: Array<taxPrice>;
    activeOrderExecution: Array<taxPrice>;
    passiveOrderExecution: Array<taxPrice>;
}
export interface taxPrice {
    type: string;
    value: number;
}
