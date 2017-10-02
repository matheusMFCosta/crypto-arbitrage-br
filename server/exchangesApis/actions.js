const mercado = require("./mercado.js");
const bitcointoyou = require("./bitcointoyou.js");
const foxbit = require("./foxbit.js");

// sendBuyerOrder (ammount, price)
// sendSellOrder = (ammount, price)
// Withdraw = (ammount,ExchangeTargetName)
async function init(exchangeName, action, param1, param2, param3) {
    var exchange;
    if (exchangeName == "mercado") exchange = mercado;
    if (exchangeName == "bitcointoyou") exchange = bitcointoyou;
    if (exchangeName == "foxbit") exchange = foxbit;

    if (action == "Withdraw") {
        var targetExchange;
        if (param2 == "mercado") targetExchange = mercado;
        if (param2 == "bitcointoyou") targetExchange = bitcointoyou;
        if (param2 == "foxbit") targetExchange = foxbit;

        const walletReference = await targetExchange.deposit();
        console.log(await exchange.Withdraw(param1, walletReference));
        return;
    }

    if (action == "sendBuyOrder") {
        console.log(await exchange.sendBuyOrder(param1, param2));
        return;
    }

    if (action == "sendSellOrder") {
        console.log(await exchange.sendSellOrder(param1, param2));
        return;
    }
    console.log(await exchange[action](param2, param1));
    return;
}

module.exports = {
    init: init
};
