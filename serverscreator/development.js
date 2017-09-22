"use strict";

var path = require("path");
var proxy = require("proxy-middleware");
var url = require("url");
var express = require("express");
var cookieParser = require("cookie-parser");
const enrouten = require("express-enrouten");

var webpack = require("webpack");
var webpackDevMiddleware = require("webpack-dev-middleware");
var config = require("../webpack/webpack.dev.config");

var fs = require("fs");
var http = require("http");
var https = require("https");
var privateKey = fs.readFileSync("serverscreator/server.key", "utf8");
var certificate = fs.readFileSync("serverscreator/server.crt", "utf8");
var server = require("./../server/index.js");

var credentials = {
    key: privateKey,
    cert: certificate,
    requestCert: false,
    rejectUnauthorized: false
};

var app = new express();
var port = 443;

console.log("Environment: DEVELOPMENT");
var compiler = webpack(config);

app.use(
    require("webpack-dev-middleware")(compiler, {
        quiet: false,
        publicPath: config.output.publicPath
    })
);
app.use(
    require("webpack-hot-middleware")(compiler, {
        log: () => {}
    })
);

server.init();

app.use(cookieParser());

app.use(enrouten({ directory: "./routes.js" }));

http.createServer(app).listen(process.env.PORT || 80);

//https.createServer(credentials, app).listen(443);

const wow = () => {
    setTimeout(function() {
        http.get("http://infinite-shelf-92987.herokuapp.com/client");
        wow();
    }, 300000); // every 5 minutes (300000)
};

wow();
