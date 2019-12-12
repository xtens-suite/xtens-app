const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

let modeEnv = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? 'production' : 'development';
const PUBLIC_PATH = path.resolve(__dirname, '.tmp/public');
const SRC_PATH = path.resolve(__dirname, 'assets');
module.exports = {
    mode: modeEnv,
    entry: `${SRC_PATH}/main.js`,
    output: {
        path: PUBLIC_PATH,
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                // loader: 'url?limit=10000&mimetype=application/font-woff'
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            mimetype: 'application/octet-stream'
                        }
                    }
                ]
            },
            {

                test: /\.ejs$/,
                use: [
                    {
                        loader: "ejs-webpack-loader",
                        options: {
                            //   data: {title: "New Title", someVar:"hello world"},
                            // htmlmin: true
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                // loader: 'style!css!sass?outputStyle=expanded'
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            outputStyle: 'expanded',
                            paths: [path.resolve(__dirname, 'assets')],
                        }
                    }
                ]

            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                loader: 'less-loader' // compiles Less to CSS
            }
        ]
    },
    devServer: {
        writeToDisk: true
    },
    //  New plugin
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            jQuery: 'jquery'
        }),
        new CopyPlugin([
            { from: path.resolve(SRC_PATH, 'index.html'), to: PUBLIC_PATH },
            { from: path.resolve('assets/images/**'), to: path.resolve(PUBLIC_PATH) }
        ])
    ]
};
