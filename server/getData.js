var fs = require("fs");

const getData = (res, exchange) => {
    fs.readFile(`./server/pointsPlot/${exchange}.txt`, "utf8", (err, data) => {
        if (err) {
            res.status(400).json({ message: "Erro ao carregar Arquivo" });
            return;
        }
        const fileData = "[" + data.slice(1, data.length) + "]";
        const pointsArray = buildPointsArray(fileData);
        res.status(200).json({ name: exchange, pointsArray: pointsArray });
    });
};

const buildPointsArray = fileData => {
    const data = JSON.parse(fileData);

    let pointsArray = [];
    for (let Key in data) {
        const currentPoint = data[Key];
        for (let i = 0; i <= currentPoint.equals + 1; i++) {
            pointsArray.push([currentPoint.bid, currentPoint.timestamp]);
        }
    }
    return pointsArray;
};

module.exports = {
    getData: getData
};
