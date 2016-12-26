const conf = require('./webpack.config')

conf.watch = true
conf.debug = true
conf.cache = true
conf.devtool = 'source-map'

module.exports = conf
