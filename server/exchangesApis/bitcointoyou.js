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
        const apiData = {};
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
            const balanceRes = res.data.oReturn[0];
            const balance = {
                BTC_locked: balanceRes.BRL - balanceRes.WithdrawalBRLPending,
                BRL: balanceRes.BRL,
                BTC: balanceRes.BTC,
                BRL_locked: balanceRes.BTC - balanceRes.OrderSellBTCPending
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

const sendBuyOrder = (amount, price) => {
    return new Promise(resolve => {
        const TAPI_MAC = getTAPI_MAC();
        const apiData = {
            asset: "BTC",
            action: "buy",
            amount: amount,
            price: price
        };
        axios({
            method: "post",
            url: "https://www.bitcointoyou.com/API/createorder.aspx?" + qs.stringify(apiData),
            headers: {
                key: config.key,
                nonce: nonce,
                signature: TAPI_MAC,
                asset: "BTC",
                action: "sell",
                amount: "0.004",
                price: "14000"
            }
        }).then(res => {
            console.log(res.data);
            resolve(balance);
        });
    });
};

const sendSellOrder = (amount, price) => {
    return new Promise(resolve => {
        const TAPI_MAC = getTAPI_MAC();
        const apiData = {
            asset: "BTC",
            action: "sell",
            amount: amount,
            price: price
        };
        axios({
            method: "post",
            url: "https://www.bitcointoyou.com/API/createorder.aspx?" + qs.stringify(apiData),
            headers: {
                key: config.key,
                nonce: nonce,
                signature: TAPI_MAC,
                asset: "BTC",
                action: "sell",
                amount: "0.004",
                price: "14000"
            }
        }).then(res => {
            console.log(res.data);
            resolve(balance);
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
