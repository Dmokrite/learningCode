const path = require('path');
const htmlPlugin = require("html-webpack-plugin");
const cssPlugin = require('mini-css-extract-plugin');
const cssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    entry: './index.js',
    mode: 'production',
    plugins: [
        new htmlPlugin({
            template: 'index.html'
        }),
        new cssPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use : [cssPlugin.loader,"css-loader"]
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'humble-bundle.js'
    },
    optimization: {
        minimizer: [
            `...`,
            new cssMinimizerPlugin()
        ]
    },
    devServer: {
        static : './dist',
        port: 8080,
        // HMR
        hot: true
    }
}