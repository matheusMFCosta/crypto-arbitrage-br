var path = require("path");
var webpack = require("webpack");

var entry = {
    myuser: ["babel-polyfill", "./client/index", "webpack-hot-middleware/client"]
};

var plugins = [
    new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("development")
        }
    }),
    new webpack.PrefetchPlugin("react"),
    new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment"),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
        __DEVELOPMENT__: true,
        __DEVPANEL__: true
    })
];

var loaders = [
    { test: /\.tsx?$/, loaders: ["react-hot-loader"] },
    {
        test: /\.tsx?$/,
        loader: "babel-loader",
        //exclude: /node_modules/,
        query: {
            cacheDirectory: false,
            babelrc: true,
            presets: ["es2017", "stage-2"]
        }
    },
    { test: /\.tsx?$/, loaders: ["ts-loader"] },
    { test: /\.css$/, loader: "style-loader!css-loader" },
    { test: /\.json$/, loader: "json-loader" },
    { test: /\.(png|jpg|woff|ttf|eot|woff2)$/, loader: "url-loader?limit=100000" },
    { test: /\.jpg$/, loader: "file-loader" }
];

module.exports = {
    entry: entry,
    webpack: function(c) {
        if (c.resolve.alias) {
            delete c.resolve.alias["react"];
            delete c.resolve.alias["react-dom"];
        }
        return c;
    },
    output: {
        path: path.join(__dirname, "..", "build", "myuser-ui"),
        filename: "bundle.js",
        publicPath: "/io-path/"
    },
    module: {
        loaders: loaders
    },
    devtool: "source-map",
    resolveLoader: {
        modules: [path.join(__dirname, "..", "node_modules")]
    },
    resolve: {
        modules: ["node_modules"],
        extensions: ["", ".web.js", ".js", ".jsx", ".ts", ".tsx"]
    },
    plugins: plugins
};
