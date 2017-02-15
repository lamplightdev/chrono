// const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './public/js/app.js',
  devtool: 'eval',
  output: {
    filename: 'app-dist.js',
    path: path.resolve(__dirname, './public/js'),
  },
  plugins: [
    /*
    new webpack.optimize.UglifyJsPlugin({
    }),
    */
  ],
};
