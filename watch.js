const fs = require('fs')
const path = require('path')
const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')

const srcPath = path.resolve('./src/')
const distPath = path.resolve('./dist/')

fs.watch(srcPath, { recursive: true }, (eventType, filename) => {
  console.log(filename)

  imagemin([path.resolve(srcPath, filename)], path.resolve(distPath, path.dirname(filename)), {
    plugins: [
      imageminMozjpeg(),
      imageminPngquant({quality: '65-80'})
    ]
  }).then(files => {
    console.log(files)
  }, error => {
    console.log(error)
  })
})
