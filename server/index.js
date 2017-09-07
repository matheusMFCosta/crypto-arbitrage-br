var fs = require("fs");
var dataFlow = require("./getData.js");
var populateGraph = require("./populateGraph.js");

const init = (req, res) => {
    if (req.originalUrl.indexOf("/server/getData") != -1) {
        const exchange = req.query.exchange;
        const period = req.query.period;
        dataFlow.getData(res, exchange, period);
    }

    if (req.originalUrl.indexOf("/server/populateGraph") != -1) {
        populateGraph.init();
    }

    if (req.originalUrl.indexOf("/server/getExchangesData") != -1) {
        dataFlow.exchangeData(res);
    }
};

module.exports = {
    init: init
};
