const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const concat = require('lodash/concat');
const omit = require('lodash/omit');
const keys = require('lodash/keys');

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
    publicPath: '/',
    devtoolModuleFilenameTemplate: info => info.resourcePath.replace(/^\.\//, '')
  },
  plugins: concat(
    [
      new ExtractTextPlugin({ filename: "[name].[chunkhash].css" }),
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
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      // extract global css into separate files
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
            use: [
              "css-loader?sourceMap",
              "sass-loader?sourceMap"
            ]
          })
      },
      {
          test: /\.(woff|ttf|eot|ico)/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]'
            }
          }]
        },
        {
          test: /\.json/,
          use: ['json-loader']
      },
      {
        test: /\.(svg|png|jpe?g|gif)/,
        use: [
          {
            loader: 'file-loader',
            options: {
                name: '[name].[hash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {}
          }
        ]
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname), "node_modules"]
  },
  devtool: "source-map",
  devServer: {
    contentBase: "/dist/",
    historyApiFallback: true
  }
};
