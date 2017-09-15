var BlinkTradeRest = require("./blinktrade.js").BlinkTradeRest;
var blinktrade = new BlinkTradeRest({
    prod: true,
    key: "YYCz5oOBVo5ZdXGvC7KLAVhCwtqU2d7ASU2JvsuVsnE",
    secret: "gVZkqVIbrM1cUGkhgMkZD1ggj2pIgxP3GvCeGGI1OpE",
    currency: "BRL"
});

let lastValues = [];

const getBalance = blinktrade => {
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

const getTicker = blinktrade => {
    return new Promise(resolve => {
        blinktrade.ticker().then(function(ticker) {
            resolve(ticker);
        });
    });
};

// 1- buy / 2-sell
const buyOfer = (blinktrade, operation, ammount, price) => {
    console.log(operation, ammount, price);
    return new Promise(resolve => {
        blinktrade
            .sendOrder({
                side: operation,
                price: price,
                amount: ammount,
                symbol: "BTCBRL"
            })
            .then(function(order) {
                resolve(oder);
            })
            .catch(function(e) {
                console.log(e);
                resolve();
            });
    });
};

async function fetchDataFoxBit() {
    // setInterval(() => {
    const ticker = await getTicker(blinktrade);
    let firstDivision = 0;
    let secondDivision = 0;
    let thirdDivision = 0;
    if (lastValues.length < 11) {
        lastValues.push(ticker.sell);
    } else {
        if (ticker.sell == lastValues[lastValues.length - 1]) {
            lastValues = lastValues.slice(1, lastValues.length);
        } else {
            lastValues.push(ticker.sell);
            for (let i = 0; i < lastValues.length; i++) {
                if (i < 4) {
                    firstDivision = firstDivision + lastValues[i];
                } else if (i >= 4 && i < 8) {
                    secondDivision = secondDivision + lastValues[i];
                } else if (i >= 8 && i < 12) {
                    thirdDivision = thirdDivision + lastValues[i];
                }
            }
            //console.log(first);
            const first = (lastValues[2] + lastValues[3]) / (lastValues[1] + lastValues[0]);
            const firstASecond = secondDivision / firstDivision;
            const thirdASecond = secondDivision / thirdDivision;
            console.log(first < 1 && firstASecond < 1 && thirdASecond > 1);
            console.log(first > 1 && firstASecond > 1 && thirdASecond < 1);
            if (first < 1 && firstASecond < 1 && thirdASecond > 1) {
                const realBalance = await getBalance(blinktrade);
                console.log();
                if (realBalance.BRL > 0) {
                    const order = await buyOfer(blinktrade, "1", realBalance.BRL, ticker.sell);
                    console.log(ticker.sell);
                    console.log("COmpra");
                }
            }
            if (first > 1 && firstASecond > 1 && thirdASecond < 1) {
                const bitBalance = await getBalance(blinktrade);
                if (bitBalance.BTC > 0) {
                    const order = await buyOfer(blinktrade, "2", bitBalance.BTC, ticker.sell);
                    console.log(ticker.sell);
                    console.log("Venda");
                }
            }
            lastValues = lastValues.slice(1, lastValues.length);
        }
    }
    //}, 10000);

    // blinktrade
    //     .sendOrder({
    //         side: "2",
    //         price: parseInt((14000.0 * 1e8).toFixed(0)),
    //         amount: parseInt((0.004 * 1e8).toFixed(0)),
    //         symbol: "BTCBRL"
    //     })
    //     .then(function(order) {
    //         console.log("ooorder", order);
    //     });

    // blinktrade
    //     .sendOrder({
    //         side: "1",
    //         price: parseInt((100 * 1e8).toFixed(0)),
    //         amount: parseInt((0.004 * 1e8).toFixed(0)),
    //         symbol: "BTCBRL"
    //     })
    //     .then(function(order) {
    //         console.log("ooorder", order);
    //     });

    //     blinktrade
    //         .sendOrder({
    //             side: "1",
    //             price: parseInt(550 * 1e8, 10),
    //             amount: parseInt(0.05 * 1e8, 10),
    //             symbol: "BTCUSD"
    //         })
    //         .then(function(order) {
    //             console.log(order);
    //             console.log("Cancelling order: #" + order[0].OrderID);
    //             return blinktrade.cancelOrder({ orderId: order[0].OrderID, clientId: order[0].ClOrdID });
    //         })
    //         .then(function(order) {
    //             console.log(order);
    //             console.log("Order: #" + order[0].OrderID + " cancelled");
    //         })
    //         .catch(function(err) {
    //             console.log(err);
    //         });

    const keys = {
        apiKey: "lG1tOZYCQesbLIxnSkOic2YowKEgwaj1jooRJfW15rU",
        senha: "zElSxQKBEuf2p4u",
        secret: "fGUDMNhKdHiOFMi3gMSDsMSX1RNHdDGH4Vk3Gx4A3mA"
    };
}

var wait = ms => new Promise(r => setTimeout(r, ms));

var repeat = (ms, func) => new Promise(r => (setInterval(func, ms), wait(ms).then(r)));

async function init() {
    try {
        repeat(10000, () => Promise.all([fetchDataFoxBit()]));
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    init: init
};
