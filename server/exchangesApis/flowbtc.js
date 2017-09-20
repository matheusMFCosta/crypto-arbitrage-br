const axios = require("axios");
const crypto = require("crypto");
var qs = require("qs");

/* ------ Mercado bitCoin personal Data * -------*/
const config = {
    Nome: "botTrade",
    key: "91fe22c2be9895e7d9d4e7b87b5597ba",
    secret: "36f250e78bac8b4c7acecf31102da9c4"
};
const user_id = "mf.costa@live.com";

let nonce = 1;

const getTAPI_MAC = () => {
    let signatureString = nonce + user_id + key;
    var hmac = crypto.createHmac("sha512", config.secret);
    hmac.update(signatureString);
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
        axios("https://api.flowbtc.com:8400/GetTicker/BTCBRL/").then(res => {
            const tickerObject = {
                last: res.data.last,
                buy: res.data.ask,
                sell: res.data.bid,
                date: +new Date()
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
        Promise.all([getTicker()]).then(res => {
            console.log(res);
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    init: init
};
