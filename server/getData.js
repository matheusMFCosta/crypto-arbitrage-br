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
    const maxPointsInGraph = 40;

    if (period == "10m") {
        return pointsArray.slice(pointsArray.length - (minParts * 10 + 1), pointsArray.length - 1);
    } else if (period == "1h") {
        const slicedArray = pointsArray.slice(pointsArray.length - (minParts * 60 + 1), pointsArray.length - 1);
        const slicedPoints = compressPointsArray(slicedArray, (minParts * 60 / maxPointsInGraph).toFixed(0));
        return slicedPoints;
    } else if (period == "6h") {
        const slicedArray = pointsArray.slice(pointsArray.length - (minParts * 360 + 1), pointsArray.length - 1);
        const slicedPoints = compressPointsArray(slicedArray, (minParts * 360 / maxPointsInGraph).toFixed(0));
        return slicedPoints;
    } else if (period == "12h") {
        const slicedArray = pointsArray.slice(pointsArray.length - (minParts * 720 + 1), pointsArray.length - 1);
        const slicedPoints = compressPointsArray(slicedArray, (minParts * 720 / maxPointsInGraph).toFixed(0));
        return slicedPoints;
    } else if (period == "24h") {
        const slicedArray = pointsArray.slice(pointsArray.length - (minParts * 1440 + 1), pointsArray.length - 1);
        const slicedPoints = compressPointsArray(slicedArray, (minParts * 1440 / maxPointsInGraph).toFixed(0));
        return slicedPoints;
    } else {
        return [];
    }
};

const compressPointsArray = (pointsArray, rate) => {
    let compressesdArray = [];
    let compressedPoit = ["", 0, 0];
    for (let pointIndex = 1; pointIndex < pointsArray.length; pointIndex++) {
        const currentPoint = pointsArray[pointIndex];
        compressedPoit[0] = currentPoint[0];
        compressedPoit[1] = compressedPoit[1] + currentPoint[1];
        compressedPoit[2] = compressedPoit[2] + currentPoint[2];
        if (pointIndex % rate == 0 && pointIndex != 1) {
            compressedPoit[1] = compressedPoit[1] / rate;
            compressedPoit[2] = compressedPoit[2] / rate;
            compressesdArray.push(compressedPoit);
            compressedPoit = ["", 0, 0];
        }
    }
    return compressesdArray;
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
