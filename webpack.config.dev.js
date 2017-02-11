const conf = require('./webpack.config')
const webpack = require('webpack')

conf.watch = true
conf.cache = true
conf.devtool = 'source-map'
conf.plugins.push(new webpack.LoaderOptionsPlugin({
  debug: true
}))

module.exports = conf
