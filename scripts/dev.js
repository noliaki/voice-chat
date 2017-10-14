const fs = require('fs-extra')
const path = require('path')
const glob = require('glob')
const bs = require('browser-sync').create()
const pugMiddleware = require('./pug').middleware
const stylusMiddleware = require('./stylus').middleware
const imageMin = require('./imagemin')
const copyFile = require('./cp-files')
const dist = require('./config').dist
const src = require('./config').src
const docRoot = require('./config').docroot

const isPug = require('./pug').regexp
const isStyl = require('./stylus').regexp
const isImage = require('./imagemin').regexp

const startPath = () => {
  const files = glob.sync(`${docRoot}/**/*.pug`)
  const initFile = files.reduce((prev, value) => {
    return prev.length > value.length ? value : prev
  })

  return `/${path.relative(docRoot, initFile).replace(/\.pug$/, '.html')}`
}

imageMin.exec()
copyFile.exec()

bs.init({
  server: {
    baseDir: dist,
    directory: true
  },
  startPath: startPath(),
  files: dist,
  ghostMode: false,
  logLevel: 'debug',
  middleware: [
    pugMiddleware,
    stylusMiddleware
  ],
  reloadDebounce: 500,
  ui: false,
  open: false
})

fs.watch(src, { recursive: true }, async (event, filename) => {
  console.log(event, filename)

  // ignore
  if (ignoreFile(filename)) {
    console.log('ignore this file')
    return
  }

  const absolutePath = path.resolve(src, filename)

  if (!fs.pathExistsSync(absolutePath)) {
    console.log('not exist')
    return
  }

  // pug or stylus
  if (isPug.test(filename) || isStyl.test(filename)) {
    console.log(path.relative(docRoot, filename))
    bs.reload()
    return
  }

  // image file
  if (isImage.test(filename)) {
    imageMin.compressImage(absolutePath)
    return
  }

  copyFile.copy(absolutePath)
})

function ignoreFile (filename) {
  return /\.ts$/.test(filename) || /\/\./.test(filename)
}
