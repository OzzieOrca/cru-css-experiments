const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const concat = require('lodash/concat');
const omit = require('lodash/omit');
const keys = require('lodash/keys');

const isBuild = process.env.npm_lifecycle_event === 'build';

const entryPoints = {
    main: './index.js',
    functional: './functional/functional.js',
    bootstrap: './bootstrap/bootstrap.js',
    foundation: './foundation/foundation.js'
};


module.exports = {
    entry: entryPoints,
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
        devtoolModuleFilenameTemplate: info => info.resourcePath.replace(/^\.\//, '')
    },
    plugins: concat(
        [
            new ExtractTextPlugin({ filename: "[name].[chunkhash].css", disable: !isBuild }),
            new HtmlWebpackPlugin({
                template: 'index.html',
                chunks: ['index']
            }),
            new HtmlWebpackPlugin({
                filename: 'functional/index.html',
                template: 'functional/index.html',
                chunks: ['functional']
            }),
            new HtmlWebpackPlugin({
                filename: 'bootstrap/index.html',
                template: 'bootstrap/index.html',
                chunks: ['bootstrap']
            }),
            new HtmlWebpackPlugin({
                filename: 'foundation/index.html',
                template: 'foundation/index.html',
                chunks: ['foundation']
            })
        ]
    ),
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [['env', { "modules": false }]],
                            plugins: ['transform-runtime']
                        }
                    }
                ]
            },
            // extract global css into separate files
            {
                test: /\.scss$/,
                use: isBuild ?
                    ExtractTextPlugin.extract({
                        use: [
                            "css-loader?sourceMap",
                            "sass-loader?sourceMap"
                        ]
                    }) :
                    [
                        "style-loader",
                        "css-loader?sourceMap",
                        "sass-loader?sourceMap"
                    ]
            },
            {
                test: /\.(json|woff|ttf|eot|ico)/,
                use: ['file-loader']
            },
            {
                test: /\.(svg|png|jpe?g|gif)/,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {}
                    }
                ]
            }
        ]
    },
    resolve: {
        modules: [path.resolve(__dirname, "src"), "node_modules"]
    },
    devtool: "source-map",
    devServer: {
        contentBase: "/dist/",
        historyApiFallback: true
    }
};
