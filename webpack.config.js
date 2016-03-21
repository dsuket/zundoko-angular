'use strict';

const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ENV = process.env.NODE_ENV;
const isTest = ENV === 'test';
const isProd = ENV === 'production';
const isDev = ENV === 'development' || ENV === '';

const config = {
  entry: {
    vendor: path.join(__dirname, 'src/vendor.ts'),
    main: path.join(__dirname, 'src/main.ts'),
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].js',
    publicPath: './'
  },
  devtool: 'cheap-module-eval-source-map',
  debug: isDev,
  // externals,
  resolve: {
    cache: !isTest,
    root: path.join(__dirname, 'src'),
    extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.html'],
    alias: {
      'techfeed': path.resolve(__dirname, '..')
    }
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        loaders: ['raw', 'css', 'postcss']
      },
      {
        test: /\.scss$/,
        loaders: ['raw', 'sass?sourceMap'],
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loaders: ['raw'],
        exclude: ['src/index.html']
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new webpack.DefinePlugin({ENV}),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: true
    })
  ],
  postcss: [
    autoprefixer({
      browsers: ['last 2 version']
    })
  ]
};
// プロダクション環境限定の調整
if (isProd) {
  config.plugins.push(
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );
}

module.exports = config;
