var BlinkTradeRest = require("./../blinktrade.js").BlinkTradeRest;
var blinktrade = new BlinkTradeRest({
    prod: true,
    key: "YYCz5oOBVo5ZdXGvC7KLAVhCwtqU2d7ASU2JvsuVsnE",
    secret: "gVZkqVIbrM1cUGkhgMkZD1ggj2pIgxP3GvCeGGI1OpE",
    currency: "BRL"
});

let lastValues = [];

const getBalance = () => {
    return new Promise(resolve => {
        blinktrade
            .balance()
            .then(function(balance) {
                resolve(balance[4]);
            })
            .catch(function(e) {
                console.log(e);
                resolve();
            });
    });
};

const getTicker = () => {
    return new Promise(resolve => {
        blinktrade.ticker().then(function(ticker) {
            console.log("tiker", ticker);
            const tickerObject = {
                last: ticker.last,
                buy: ticker.buy,
                sell: ticker.sell,
                date: +new Date()
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
            console.log("FOXBIT");
            console.log(res);
            console.log("_____");
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    init: init
};
