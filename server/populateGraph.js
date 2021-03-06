const ccxt = require("ccxt");
var fs = require("fs");
var axios = require("axios");

// let lastNodeElement = [];
// let numberOfSameNode = 0;

async function fetchDataFoxBit() {
    const foxbit = new ccxt.foxbit();
    const market = await foxbit.fetchTicker("BTC/BRL");
    return {
        name: "foxbit",
        bid: market.bid,
        ask: market.ask,
        timestamp: +new Date()
    };
}

async function fetchDataMercadoBitcoin() {
    const market = await axios("https://www.mercadobitcoin.net/api/BTC/ticker/");
    const tickerObject = {
        name: "mercado",
        ask: parseFloat(market.data.ticker.sell),
        bid: parseFloat(market.data.ticker.buy),
        timestamp: market.data.ticker.date
    };
    return tickerObject;
}

async function fetchDataBitcointoyouBTC() {
    const data = await axios("https://www.bitcointoyou.com/API/ticker.aspx").then(res => {
        return {
            name: "bitcointoyou",
            ask: parseFloat(res.data.ticker.buy),
            bid: parseFloat(res.data.ticker.sell),
            timestamp: +new Date()
        };
        resolve(tickerObject);
    });
    return data;
}

async function fetchDataBraziliex() {
    const market = await axios("http://braziliex.com/api/v1/public/ticker/btc_brl");

    return {
        name: "braziliex",
        bid: parseFloat(market.data.lowestAsk),
        ask: parseFloat(market.data.highestBid),
        timestamp: +new Date()
    };
}

async function fetchDataNegocieCoins() {
    const market = await axios("https://broker.negociecoins.com.br/api/v3/BTCBRL/ticker");
    return {
        name: "negocieCoins",
        bid: parseFloat(market.data.buy),
        ask: parseFloat(market.data.sell),
        timestamp: market.data.date
    };
}

async function fetchData() {
    try {
        Promise.all([
            await fetchDataBitcointoyouBTC(),
            await fetchDataFoxBit(),
            await fetchDataMercadoBitcoin(),
            await fetchDataBraziliex(),
            await fetchDataNegocieCoins()
        ])
            .then(response => {
                for (let key in response) {
                    const currentNode = response[key];
                    if (currentNode.name) {
                        // if (!lastNodeElement[currentNode.name]) {
                        //     lastNodeElement[currentNode.name] = {};
                        //     lastNodeElement[currentNode.name]["currentNode"] = currentNode;
                        //     lastNodeElement[currentNode.name]["numberOfSameNode"] = numberOfSameNode;
                        // }

                        // if (
                        //     lastNodeElement[currentNode.name].currentNode.name != currentNode.name ||
                        //     lastNodeElement[currentNode.name].currentNode.bid != currentNode.bid ||
                        //     lastNodeElement[currentNode.name].currentNode.ask != currentNode.ask
                        // ) {
                        // currentNode["equals"] = lastNodeElement[currentNode.name].numberOfSameNode;
                        // lastNodeElement[currentNode.name].numberOfSameNode = 0;
                        const nodeData = "," + JSON.stringify(currentNode);
                        fs.appendFile(`./server/pointsPlot/${currentNode.name}.txt`, nodeData, "utf-8", function(err) {
                            if (err) {
                                throw err;
                            }
                        });
                        // } else {
                        //     lastNodeElement[currentNode.name].numberOfSameNode = lastNodeElement[currentNode.name].numberOfSameNode + 1;
                        // }
                        //lastNodeElement[currentNode.name].currentNode = currentNode;
                    }
                }
            })
            .then(function() {
                new Promise(resolve => setTimeout(_ => fetchData(), 5000));
            })
            .catch(err => {
                new Promise(resolve => setTimeout(_ => fetchData(), 5000));
            });
    } catch (err) {
        new Promise(resolve => setTimeout(_ => fetchData(), 5000));
    }
}

module.exports = {
    init: fetchData
};
