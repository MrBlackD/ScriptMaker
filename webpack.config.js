var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var webpack = require('webpack');

var PROD = {
    entry: './src/main/js/index.js',
    devtool: 'sourcemaps',
    cache: true,
    output: {
        path: __dirname,
        filename: './src/main/resources/static/built/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: [{
                    loader:'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['es2015', 'react','stage-1']
                    }
                }],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use:[{
                    loader:'file-loader',
                    options:{
                        outputPath:'./src/main/resources/static/built/'
                    }
                }]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use:[{
                    loader:'file-loader',
                    options:{
                        outputPath:'./src/main/resources/static/built/'
                    }
                }]
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            title: 'ScriptMaker',
            filename: './src/main/resources/templates/index.html',
            template: './src/main/resources/templates/template.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],

};

var DEV = {
    entry: './src/main/js/index.js',
    cache: true,
    devtool: "cheap-eval-source-map",
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins:[
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'ScriptMaker',
            filename: 'index.html',
            template: './src/main/resources/templates/template.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: [{
                    loader:'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['es2015', 'react','stage-1']
                    }
                }],

            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use:[
                    'file-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use:[
                    'file-loader'
                ]
            }
        ]
    },
    devServer: {
        hot: true,
        contentBase: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        port:9000
    }
};

module.exports = function(env) {
    if(env==="dev"){
        return DEV;
    }
    if(env==="prod"){
        return PROD;
    }
};