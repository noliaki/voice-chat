const path = require('path')
const webpack = require('webpack')

module.exports = {
  context: path.resolve('./src', 'js/'),
  entry: {
    index: './index.js'
  },
  output: {
    path: path.resolve('./dist', 'js'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use:[{
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
    // new webpack.ProvidePlugin({
    //   $: "jquery",
    //   jQuery: "jquery",
    //   "window.jQuery": "jquery"
    // })
  ]
};
