var path = require("path");
var webpack = require("webpack");

var entry = {
    myuser: ["babel-polyfill", "./client/index", "./server/index", "./server/index"]
};

var plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
        __DEVELOPMENT__: false,
        __DEVPANEL__: false
    }),
    new webpack.DefinePlugin({
        "process.env.NODE_ENV": '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    })
];

var loaders = [
    {
        test: /\.tsx?$/,
        loader: "babel-loader",
        //exclude: /node_modules/,
        query: {
            cacheDirectory: false,
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
    output: {
        path: path.join(__dirname, "..", "build", "myuser-ui", "io-path"),
        filename: "bundle.js",
        publicPath: "/io-path/"
    },
    module: {
        loaders: loaders
    },
    plugins: plugins,
    devtool: "cheap-module-source-map",
    // resolveLoader: {
    //     modules: [path.join(__dirname, '..', "node_modules")]
    // },
    resolve: {
        modules: ["node_modules"],
        extensions: ["*", ".web.js", ".js", ".jsx", ".ts", ".tsx"]
    }
};
