const axios = require("axios");
const crypto = require("crypto");
var qs = require("qs");

var BlinkTradeRest = require("./../blinktrade.js").BlinkTradeRest;
const config = {
    prod: true,
    key: "5dbbb7df-aae2-441e-a603-73dfd6eb8347",
    secret: "FD73B924AA2E99BBE53FD5EB148C5D1D",
    currency: "BRL"
};

// const config = {
//     prod: true,
//     key: "Message",
//     secret: "secret",
//     currency: "BRL"
// };

let lastValues = [];

let nonce = +new Date();

const getTAPI_MAC = () => {
    const message = nonce + config.key;
    var hmac = crypto.createHmac("sha256", config.secret);
    hmac.update(message);
    const TAPI_MAC = hmac.digest("base-64");
    return new Buffer(TAPI_MAC).toString("base64").toLocaleUpperCase();
};

const getBalance = () => {
    return new Promise(resolve => {
        const TAPI_MAC = getTAPI_MAC();
        console.log(TAPI_MAC);
        const apiData = {
            key: config.key,
            nonce: nonce,
            signature: TAPI_MAC
        };
        console.log(apiData);

        axios({
            method: "post",
            url: "https://www.bitcointoyou.com/API/balance.aspx",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                key: config.key,
                nonce: nonce,
                signature: TAPI_MAC
            },
            data: qs.stringify(apiData)
        }).then(res => {
            console.log(res.data);
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
        axios("https://www.bitcointoyou.com/API/ticker.aspx").then(res => {
            const tickerObject = {
                last: res.data.ticker.last,
                buy: res.data.ticker.buy,
                sell: res.data.ticker.sell,
                date: res.data.ticker.date
            };
            resolve(tickerObject);
        });
    });
};

// 1- buy / 2-sell
const sendBuyOrder = (ammount, price) => {
    return new Promise(resolve => {
        blinktrade
            .sendOrder({
                side: "1",
                price: price,
                amount: ammount,
                symbol: "BTCBRL"
            })
            .then(function(order) {
                console.log(order);
                resolve(order);
            })
            .catch(function(e) {
                console.log(e);
                resolve();
            });
    });
};

const sendSellOrder = (ammount, price) => {
    return new Promise(resolve => {
        blinktrade
            .sendOrder({
                side: "2",
                price: price,
                amount: ammount,
                symbol: "BTCBRL"
            })
            .then(function(order) {
                console.log(order);
                resolve(order);
            })
            .catch(function(e) {
                console.log(e);
                resolve();
            });
    });
};

const Withdraw = (ammount, walletReference) => {
    return new Promise(resolve => {
        blinktrade
            .requestWithdraw({
                amount: parseInt(ammount * 1e8),
                currency: "BTC",
                method: "bitcoin",
                data: {
                    Wallet: walletReference
                }
            })
            .then(function(respose) {
                console.log(response);
                resolve(response);
            })
            .catch(function(err) {
                console.log(err);
            });
    });
};

const deposit = () => {
    return new Promise(resolve => {
        blinktrade
            .requestDeposit()
            .then(function(deposit) {
                console.log(deposit);
                resolve(response);
            })
            .catch(function(e) {
                console.log(e);
                resolve();
            });
    });
};

async function init() {
    try {
        Promise.all([getBalance(), getTicker()]).then(res => {
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
