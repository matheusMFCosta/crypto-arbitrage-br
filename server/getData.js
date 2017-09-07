var fs = require("fs");

const getData = (res, exchange, period) => {
    fs.readFile(`./server/pointsPlot/${exchange}.txt`, "utf8", (err, data) => {
        if (err) {
            res.status(400).json({ message: "Erro ao carregar Arquivo" });
            return;
        }
        const fileData = "[" + data.slice(1, data.length) + "]";
        const pointsArray = buildPointsArray(fileData);
        const filterByPeriod = filterPointsArrayByPeriod(period, pointsArray);
        res.status(200).json({ name: exchange, pointsArray: filterByPeriod });
    });
};

const buildPointsArray = fileData => {
    const data = JSON.parse(fileData);

    let pointsArray = [];
    for (let Key in data) {
        const currentPoint = data[Key];
        //for (let i = 0; i <= currentPoint.equals + 1; i++) {
        var date = new Date(currentPoint.timestamp);
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();
        var formattedTime = hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
        pointsArray.push([formattedTime, currentPoint.bid, currentPoint.ask]);
        //}
    }
    return pointsArray;
};

const filterPointsArrayByPeriod = (period, pointsArray) => {
    const minParts = 4;

    if (period == "10m") {
        return pointsArray.slice(pointsArray.length - (minParts * 10 + 1), pointsArray.length - 1);
    } else if (period == "1h") {
        return pointsArray.slice(pointsArray.length - (minParts * 60 + 1), pointsArray.length - 1);
    } else if (period == "6h") {
        return pointsArray.slice(pointsArray.length - (minParts * 360 + 1), pointsArray.length - 1);
    } else if (period == "12h") {
        return pointsArray.slice(pointsArray.length - (minParts * 720 + 1), pointsArray.length - 1);
    } else if (period == "24h") {
        return pointsArray.slice(pointsArray.length - (minParts * 1440 + 1), pointsArray.length - 1);
    } else {
        return [];
    }
};

const exchangeData = res => {
    fs.readFile(`./server/storesPrices.json`, "utf8", (err, data) => {
        if (err) {
            res.status(400).json({ message: "Erro ao carregar Arquivo" });
            return;
        }
        res.status(200).json(JSON.parse(data));
    });
};

module.exports = {
    getData: getData,
    exchangeData: exchangeData
};
