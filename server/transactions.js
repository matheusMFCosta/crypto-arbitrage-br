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
    return new Promise(resolve => {
        blinktrade
            .sendOrder({
                side: operation,
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

//guess compra e venda
async function fetchDataFoxBit() {
    // setInterval(() => {
    const ticker = await getTicker(blinktrade);
    let firstDivision = 0;
    let secondDivision = 0;
    let thirdDivision = 0;
    let fourthDivision = 0;
    let fivethdDivision = 0;
    let sixhDivision = 0;
    let seventhdDivision = 0;
    let eigthDivision = 0;
    let ninehDivision = 0;
    const arraySize = 36;
    //cria um array de minimo 108 elements - 15 seg de diferenca cada pomto
    if (lastValues.length < arraySize - 1) {
        console.log(lastValues);
        lastValues.push(ticker.buy);
    } else {
        //se o proximo valor for igual o antigo so espera o proximo
        if (ticker.buy == lastValues[lastValues.length - 1]) {
        } else {
            console.log(lastValues);
            lastValues.push(ticker.buy);
            //pra cada elemeto do array divide ele em 3 para fazer calculos
            for (let i = 0; i < lastValues.length; i++) {
                if (i < arraySize * 1 / 9) {
                    firstDivision = firstDivision + lastValues[i];
                } else if (i >= arraySize * 1 / 9 && i < arraySize * 2 / 9) {
                    secondDivision = secondDivision + lastValues[i];
                } else if (i >= arraySize * 2 / 9 && i < arraySize * 3 / 9) {
                    thirdDivision = thirdDivision + lastValues[i];
                } else if (i >= arraySize * 3 / 9 && i < arraySize * 4 / 9) {
                    fourthDivision = fourthDivision + lastValues[i];
                } else if (i >= arraySize * 4 / 9 && i < arraySize * 5 / 9) {
                    fivethdDivision = fivethdDivision + lastValues[i];
                } else if (i >= arraySize * 5 / 9 && i < arraySize * 6 / 9) {
                    sixhDivision = sixhDivision + lastValues[i];
                } else if (i >= arraySize * 6 / 9 && i < arraySize * 7 / 9) {
                    seventhdDivision = seventhdDivision + lastValues[i];
                } else if (i >= arraySize * 7 / 9 && i < arraySize * 8 / 9) {
                    eigthDivision = eigthDivision + lastValues[i];
                } else if (i >= arraySize * 8 / 9 && i < arraySize * 9 / 9) {
                    ninehDivision = ninehDivision + lastValues[i];
                }
            }
            //console.log(first);
            const first = (thirdDivision + fourthDivision) / (secondDivision + firstDivision);
            const firstASecond = (fivethdDivision + sixhDivision) / (thirdDivision + fourthDivision);
            const SecondAThird = (ninehDivision + eigthDivision) / (seventhdDivision + sixhDivision);
            //ve se descida , descida e subida e compra
            if (first < 1 && firstASecond < 1 && SecondAThird > 1) {
                const realBalance = await getBalance(blinktrade);
                if (realBalance.BRL > 10000000) {
                    const order = await buyOfer(
                        blinktrade,
                        "1",
                        parseInt(((realBalance.BRL - 5000000) / ticker.buy).toFixed(0)),
                        parseInt((ticker.buy * 1e8).toFixed(0))
                    );
                    console.log("COmpra");
                }
                lastValues = lastValues.slice(36, lastValues.length);
            }
            //ve se subida , subida e descida e vende
            if (secondDivision / firstDivision > 1 && firstASecond < 1 && SecondAThird < 1) {
                const bitBalance = await getBalance(blinktrade);
                if (bitBalance.BTC > 100000) {
                    const order = await buyOfer(blinktrade, "2", parseInt(bitBalance.BTC), parseInt((ticker.buy * 1e8).toFixed(0)));
                    console.log("Venda");
                }
                lastValues = lastValues.slice(5, lastValues.length);
            }
            lastValues = lastValues.slice(1, lastValues.length);
        }
    }
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
