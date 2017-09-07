const ccxt = require("ccxt");
var fs = require("fs");

// let lastNodeElement = [];
// let numberOfSameNode = 0;

async function fetchDataFoxBit() {
    const foxbit = new ccxt.foxbit();
    const market = await foxbit.fetchTicker("BTC/BRL");
    return {
        name: "foxbit",
        cost: 0.005,
        bid: market.bid,
        ask: market.ask,
        timestamp: market.timestamp
    };
}

async function fetchDataMercadoBitcoin() {
    const mercado = new ccxt.mercado();
    const market = await mercado.fetchTicker("BTC/BRL");

    return {
        name: "mercado",
        cost: 0.007,
        bid: market.bid,
        ask: market.ask,
        timestamp: market.timestamp
    };
}

async function fetchDataFlowBTC() {
    const flowbtc = new ccxt.flowbtc();
    const market = await flowbtc.fetchTicker("BTC/BRL");

    return {
        name: "flowbtc",
        cost: 0.0035,
        bid: market.bid,
        ask: market.ask,
        timestamp: market.timestamp
    };
}

async function fetchData() {
    try {
        Promise.all([await fetchDataFoxBit(), await fetchDataMercadoBitcoin(), await fetchDataFlowBTC()])
            .then(response => {
                console.log("newStep");
                for (let key in response) {
                    const currentNode = response[key];
                    console.log(key, currentNode);

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
                new Promise(resolve => setTimeout(_ => fetchData(), 15000));
            })
            .catch(err => {
                new Promise(resolve => setTimeout(_ => fetchData(), 15000));
            });
    } catch (err) {
        new Promise(resolve => setTimeout(_ => fetchData(), 15000));
    }
}

module.exports = {
    init: fetchData
};
