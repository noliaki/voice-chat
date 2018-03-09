const path = require('path')
const glob = require('glob')
const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')

const paths = require('./paths')
const config = require('../config').imagemin
const imageExt = '*.{jpg,jpeg,gif,png,svg}'

const compressImage = filename => {
  const relPath = path.relative(paths.docroot, path.dirname(filename))
  const distPath = path.resolve(paths.dist, relPath)

  imagemin([filename], distPath, {
    plugins: [
      imageminJpegtran(config.jpegtran),
      imageminPngquant(config.pngquant),
      imageminSvgo(config.svgo)
    ]
  }).then(files => {
    files.forEach(file => {
      console.log(`imagemin compress: ${file.path}`)
    })
  })
}
exports.compressImage = compressImage

const exec = () => {
  const files = glob.sync(`${paths.docroot}/**/${imageExt}`, {
    nodir: true
  })
    .map(filename => path.dirname(filename))
    .filter((dirname, index, filesArr) => filesArr.indexOf(dirname) === index)

  files.forEach(file => {
    compressImage(path.resolve(file, imageExt))
  })
}
exports.exec = exec
