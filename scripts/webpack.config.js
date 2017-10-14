const webpack = require('webpack')
const path = require('path')
const glob = require('glob')
const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
]
const docRoot = require('./config').docroot
const distDir = require('./config').dist
const srcDir = require('./config').src

function entries () {
  const files = glob.sync(`${docRoot}/**/*.ts`)
  const entriesObj = {}
  files.forEach(file => {
    const filePath = `./${path.relative(docRoot, file)}`
    entriesObj[filePath.replace(/\/ts\//gm, '/js/').replace(/\.ts$/, '')] = filePath
  })

  return entriesObj
}

const config = {
  context: docRoot,
  entry: entries(),
  output: {
    path: distDir,
    filename: '[name].js'
  },
  resolve: {
    alias: {
      '@': `${srcDir}/modules/ts`
    },
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true
      }
    })
  ])
}

if (process.env.NODE_ENV === 'development') {
  config.watch = true
  config.cache = true
  config.devtool = 'source-map'
  config.plugins = plugins.concat([
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ])
}

module.exports = config
