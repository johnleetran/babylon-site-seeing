const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
let outputDirectory = path.resolve(__dirname, 'docs')
module.exports = {
    entry:  './game.ts',
    output: {
        path: outputDirectory,
        filename: 'game.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',
    plugins: [

    ],
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    mode: 'prodction',
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'index.html', to: `${outputDirectory}/index.html` },
                { from: 'duck.glb', to: `${outputDirectory}/duck.glb` },
                { from: 'shoe.glb', to: `${outputDirectory}/shoe.glb` },
            ],
        }),
    ],
}