var fs = require("fs");
var dataFlow = require("./getData.js");

const init = (req, res) => {
    if (req.originalUrl.indexOf("/server/getData") != -1) {
        const exchange = req.query.exchange;
        dataFlow.getData(res, exchange);
    }
};

module.exports = {
    init: init
};
