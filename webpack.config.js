const path = require('path')
const webpack = require('webpack')
const childProcess = require('child_process')
const MyWebpackPlugin = require('./webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssWebpackPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: './app.js'
    },
    output:{
        path:  path.resolve('./dist'),
        filename: '[name].js'
    },
    module:{
        rules:[
            {
                test: /\.css$/,
                use: [
                    process.env.NODE_ENV === 'production' ? MiniCssWebpackPlugin.loader :
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    // publicPath: './dist/',
                    name: '[name].[ext]?[hash]',
                    limit: 20000, //3kb
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins:[
        new webpack.BannerPlugin({
            banner: `
            Build Date: ${new Date().toLocaleDateString()}
            Commit Version: ${childProcess.execSync('git rev-parse --short HEAD')}
            Author: ${childProcess.execSync('git config user.name')}`
        }),
        new webpack.DefinePlugin({
            TWO: JSON.stringify('1+1'), //전역변수
            'api.domain': JSON.stringify('https://dev.api.domain.com')
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            templateParameters:{
                env: process.env.NODE_ENV === 'development' ? '(개발용)' : ''
            },
            minify: process.env.NODE_ENV === 'production' ? {
                collapseWhitespace: true, //빈칸 제거
                removeComments: true //주석 제거
            } : false
        }),
        new CleanWebpackPlugin(),
        ...(process.env.NODE_ENV === 'production') ?
        [new MiniCssWebpackPlugin({
            filename: '[name].css'
        })] : []

    ]
}