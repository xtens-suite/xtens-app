const path = require('path');
const webpack = require('webpack');
let modeEnv = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? 'production' : 'development';
const PUBLIC_PATH = path.resolve(__dirname, '../.tmp/public');
const SRC_PATH = path.resolve(__dirname, '../assets');
module.exports.webpack = {
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
                            outputStyle: 'expanded'
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
        new webpack.HotModuleReplacementPlugin()
    ]
};
