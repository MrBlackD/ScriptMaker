var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var webpack = require('webpack');

const moduleProps = {
    rules: [
        {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: [{
                loader:'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react','stage-0']
                }
            }],
        },
        {
            test: /\.(css|less)$/,
            use: ['style-loader', 'css-loader','less-loader']
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use:[{
                loader:'file-loader',
            }]
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use:[{
                loader:'file-loader',
            }]
        }
    ]
}

var PROD = {
    entry: ["babel-polyfill", './src/main/js/index.js'],
    devtool: 'sourcemaps',
    cache: true,
    output: {
        path: path.resolve(__dirname,"src/main/resources/static/app"),
        filename: 'bundle.js'
    },
    module: moduleProps,
    plugins:[
        new HtmlWebpackPlugin({
            title: 'ScriptMaker',
            filename: 'index.html',
            template: './src/main/resources/templates/template.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],

};

var DEV = {
    entry: ["babel-polyfill", './src/main/js/index.js'],
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
    module: moduleProps,
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