const fs = require('fs-extra')
const path = require('path')
const glob = require('glob')
const docRoot = require('./config').docroot
const distPath = require('./config').dist

const isPug = require('./pug').regexp
const isStylus = require('./stylus').regexp
const isImage = require('./imagemin').regexp
const isScript = /\.ts$/

const copy = filename => {
  if (!shouldCopy(filename)) {
    return
  }

  const distFile = path.resolve(distPath, path.relative(docRoot, filename))

  fs.ensureDirSync(path.dirname(distFile))
  fs.copyFile(filename, distFile, error => {
    if (error) throw error

    console.log(`copy done: ${distFile}`)
  })
}

const exec = () => {
  const files = glob.sync(`${docRoot}/**/*`, {
    nocase: true,
    nodir: true
  }).filter(file => shouldCopy(file))

  files.forEach(file => {
    copy(file)
  })
}

function shouldCopy (filename) {
  return !(isPug.test(filename) || isStylus.test(filename) || isImage.test(filename) || isScript.test(filename))
}

module.exports = {
  exec,
  copy
}
