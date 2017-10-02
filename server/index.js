var fs = require("fs");
var dataFlow = require("./getData.js");
var populateGraph = require("./populateGraph.js");
var transactions = require("./transactions.js");
var messageApp = require("./messageApp.js");

const action = require("./exchangesApis/actions.js");
const init = (req, res) => {
    action.init("bitcointoyou", "getBalance", "4691659312", "14682");
    //flowbtc.init();
    //populateGraph.init();
    // messageApp.init();
    // transactions.init();
};

const route = (req, res) => {
    if (req.originalUrl.indexOf("/server/getData") != -1) {
        const exchange = req.query.exchange;
        const period = req.query.period;
        dataFlow.getData(res, exchange, period);
    }

    if (req.originalUrl.indexOf("/server/getExchangesData") != -1) {
        dataFlow.exchangeData(res);
    }
};

module.exports = {
    init: init,
    route: route
};
