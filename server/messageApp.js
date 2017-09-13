const TelegramBot = require("node-telegram-bot-api");
const token = "390615501:AAHsn_2VbhP7SbCCa4MAIgrqj0BMRJKDy9c";
var fs = require("fs");
const chats = [400081962];
const bot = new TelegramBot(token, { polling: true });

const getExchangeStoreTaxData = (exchangeStore, exchangeStoresTax) => {
    for (let key in exchangeStoresTax) {
        if (exchangeStoresTax[key].name == exchangeStore) return exchangeStoresTax[key];
    }
    return exchangeStoresTax[0];
};

const calculateTaxOverInvestment = (investValue, taxPrices, exchangeStoreTaxData1) => {
    let totalTax = 0;
    for (let key in taxPrices) {
        const currentTax = taxPrices[key];
        if (currentTax.type == "real") {
            totalTax = totalTax + currentTax.value;
        }
        if (currentTax.type == "percent") {
            totalTax = totalTax + investValue * currentTax.value;
        }
        if (currentTax.type == "bitcoin") {
            totalTax = totalTax + currentTax.value * exchangeStoreTaxData1;
        }
    }
    return totalTax;
};

const buildInvestmentValues = (investValue, exchangeStoreBidPrice, exchangeStoreAskPrice, exchangeStoreTaxData1, exchangeStoreTaxData2) => {
    const difFPorcentage = 100 - exchangeStoreAskPrice * 100 / exchangeStoreBidPrice;
    //const diffPorcentageInvetiment = difFPorcentage / 100 * investValue;
    const costWithWithDraw = calculateTaxOverInvestment(investValue, exchangeStoreTaxData1.bitWithDraw, exchangeStoreBidPrice);
    const costWithBitDeposit = calculateTaxOverInvestment(investValue, exchangeStoreTaxData2.bitDeposit, exchangeStoreAskPrice);
    const investmentFinalValue = (difFPorcentage / 100 + 1) * (investValue - costWithWithDraw - costWithBitDeposit);
    const profit = investmentFinalValue - investValue;
    //const investmentFinalValue = investValue + profit;

    return {
        difFPorcentage,
        costWithWithDraw,
        costWithBitDeposit,
        profit,
        investmentFinalValue
    };
};

const init = () => {
    const exchanges = ["foxbit", "flowbtc", "mercado", "braziliex", "negocieCoins"];
    setTimeout(() => {
        console.log("nexStep app");
        for (let i = 0; i < exchanges.length; i++) {
            for (let j = 0; j < exchanges.length; j++) {
                if (i != j) {
                    const firstFileName = exchanges[i] + ".txt";
                    const secondFileName = exchanges[j] + ".txt";
                    //console.log(firstFileName);
                    const firstFilePlotData = fs.readFileSync(`./server/pointsPlot/${firstFileName}`, "utf8");
                    const firstExchangePoints = JSON.parse("[" + firstFilePlotData.slice(1, firstFilePlotData.length) + "]");
                    const firstExchangePoint = firstExchangePoints[Object.keys(firstExchangePoints).length - 1];

                    const secondFilePlotData = fs.readFileSync(`./server/pointsPlot/${secondFileName}`, "utf8");
                    const secondExchangePoints = JSON.parse("[" + secondFilePlotData.slice(1, secondFilePlotData.length) + "]");
                    const secondExchangePoint = secondExchangePoints[Object.keys(secondExchangePoints).length - 1];

                    const exchangeStoresTax = fs.readFileSync(`./server/storesPrices.json`, "utf8");
                    const exchangeStoreTaxData1 = getExchangeStoreTaxData(firstExchangePoint, exchangeStoresTax);
                    const exchangeStoreTaxData2 = getExchangeStoreTaxData(secondExchangePoint, exchangeStoresTax);
                    const investValue = 200;

                    const taxValues = buildInvestmentValues(
                        investValue,
                        secondExchangePoint.bid,
                        firstExchangePoint.ask,
                        exchangeStoreTaxData1,
                        exchangeStoreTaxData2
                    );
                    if (taxValues.profit + investValue >= investValue * 102 / 100) {
                        const message = {
                            origin: firstExchangePoint.name,
                            target: secondExchangePoint.name,
                            profit: taxValues.propfit,
                            investiment: investValue,
                            investmentFinalValue: taxValues.investmentFinalValue
                        };
                        bot.sendMessage(chats[0], JSON.stringify(message, null, "\t"));
                    }
                    init();
                }
            }
        }
    }, 30000);
};

module.exports = {
    init: init,
    bot: bot,
    chats: chats
};
