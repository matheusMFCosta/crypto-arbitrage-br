const axios = require("axios");
const crypto = require("crypto");
var qs = require("qs");

/* ------ Mercado bitCoin personal Data * -------*/
const config = {
    Nome: "botTrade",
    key: "c550a072a3be4ec172b50be42102b171",
    secret: "e4d63e75f696835cec8b88294620f5a24faa02ca36eae9648cc97dcd7959aa09"
};

const securePin = 7333;
const walletreference = "1BH7pJPRCyqHa7B5CisiYjHwku55wzhNTB";

let nonce = 584;

const getTAPI_MAC = params => {
    let message = "/tapi/v3/?";
    const paramsKeys = Object.keys(params);
    for (let keys in paramsKeys) {
        currentKey = paramsKeys[keys];
        message += currentKey + "=" + params[currentKey] + "&";
    }
    message = message.slice(0, message.length - 1);
    var hmac = crypto.createHmac("sha512", config.secret);
    hmac.update(message);
    const TAPI_MAC = hmac.digest("hex");
    return TAPI_MAC;
};

const getBalance = () => {
    return new Promise(resolve => {
        nonce++;
        const apiData = {
            tapi_method: "get_account_info",
            tapi_nonce: nonce
        };
        const TAPI_MAC = getTAPI_MAC(apiData);
        axios({
            method: "post",
            url: "https://www.mercadobitcoin.net/tapi/v3/",
            headers: { "Content-Type": "application/x-www-form-urlencoded", "TAPI-ID": config.key, TAPI_MAC: TAPI_MAC },
            data: qs.stringify(apiData)
        }).then(res => {
            const balanceRes = res.data.response_data.balance;
            const balance = {
                BTC_locked: balanceRes.btc.total - balanceRes.btc.available,
                BRL: balanceRes.brl.available,
                BTC: balanceRes.btc.available,
                BRL_locked: balanceRes.brl.total - balanceRes.brl.available
            };
            resolve(balance);
        });
    });
};

const getTicker = () => {
    return new Promise(resolve => {
        axios("https://www.mercadobitcoin.net/api/BTC/ticker/").then(res => {
            const tickerObject = {
                last: res.data.ticker.last,
                buy: res.data.ticker.buy,
                sell: res.data.ticker.sell,
                timestamp: res.data.ticker.date
            };
            resolve(tickerObject);
        });
    });
};

// 1- buy / 2-sell
const sendBuyOrder = (ammount, price) => {
    return new Promise(resolve => {
        nonce++;
        const apiData = {
            tapi_method: "place_buy_order",
            tapi_nonce: nonce,
            coin_pair: "BRLBTC",
            quantity: String(ammount),
            limit_price: String(price)
        };
        const TAPI_MAC = getTAPI_MAC(apiData);
        axios({
            method: "post",
            url: "https://www.mercadobitcoin.net/tapi/v3/",
            headers: { "Content-Type": "application/x-www-form-urlencoded", "TAPI-ID": config.key, TAPI_MAC: TAPI_MAC },
            data: qs.stringify(apiData)
        }).then(res => {
            resolve(res.data);
        });
    });
};

const sendSellOrder = (ammount, price) => {
    return new Promise(resolve => {
        nonce++;
        const apiData = {
            tapi_method: "place_sell_order",
            tapi_nonce: nonce,
            coin_pair: "BRLBTC",
            quantity: String(ammount),
            limit_price: String(price)
        };
        const TAPI_MAC = getTAPI_MAC(apiData);
        axios({
            method: "post",
            url: "https://www.mercadobitcoin.net/tapi/v3/",
            headers: { "Content-Type": "application/x-www-form-urlencoded", "TAPI-ID": config.key, TAPI_MAC: TAPI_MAC },
            data: qs.stringify(apiData)
        }).then(res => {
            resolve(res.data);
        });
    });
};

const Withdraw = (ammount, walletReference) => {
    return new Promise(resolve => {
        nonce++;
        const apiData = {
            tapi_method: "place_sell_order",
            tapi_nonce: nonce,
            coin: "BTC",
            description: "Tranferencia mercado",
            address: walletReference,
            quantity: ammount,
            tx_fee: "0,00001"
        };
        // TODO OLHO O TX_FEE
        const TAPI_MAC = getTAPI_MAC(apiData);
        axios({
            method: "post",
            url: "https://www.mercadobitcoin.net/tapi/v3/",
            headers: { "Content-Type": "application/x-www-form-urlencoded", "TAPI-ID": config.key, TAPI_MAC: TAPI_MAC },
            data: qs.stringify(apiData)
        }).then(res => {
            resolve(res.data);
        });
    });
};

const deposit = () => {
    return { walletreference: walletreference };
};

async function init() {
    try {
        Promise.all([getBalance(), getTicker(), sendBuyOrder(0.01, 100.0), sendSellOrder(0.01, 100.0)]).then(res => {
            console.log(res);
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    init: init,
    getBalance,
    getTicker,
    sendBuyOrder,
    sendSellOrder,
    Withdraw,
    deposit
};
