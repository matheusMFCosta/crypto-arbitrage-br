var server = require("./../server/index.js");
var path = require("path");

module.exports = router => {
    router.get("/client", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/indexDev.html"));
    });

    router.get("/server*", (req, res) => {
        server.route(req, res);
    });
};
