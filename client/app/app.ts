export interface App {
    init: boolean;
    exchangeStoresData: exchangeStoresData;
}

export type exchangeStoresData = Array<exchangeStoreData>;
export type exchangeStoreData = { name: string; dataArray: [number, number] };
