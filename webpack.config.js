//@ts-check

'use strict';

const path = require('path');

/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const cliConfig = {
  target: 'node',
  // 'none' keeps the bundle as close as possible to the extension build and
  // avoids any transform that could alter generator behavior
  mode: 'none',
  entry: './cli.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'cli.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  devtool: false
};
module.exports = [ cliConfig ];
