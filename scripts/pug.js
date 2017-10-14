const pug = require('pug')
const glob = require('glob')
const path = require('path')
const fs = require('fs-extra')
const url = require('url')
const HTMLHint = require('htmlhint').HTMLHint

const docRoot = require('./config').docroot
const src = require('./config').src
const dist = require('./config').dist

const regexp = /\.pug$/

const defaultOption = {
  basedir: `${src}/modules/pug`,
  pretty: process.env.NODE_ENV !== 'production'
}

const renderPug = async filename => {
  const html = await compile(filename)
  const distPath = path.resolve(dist, path.relative(docRoot, filename))

  fs.ensureDirSync(path.dirname(distPath))

  const htmlFileName = distPath.replace(/\.pug$/, '.html')

  fs.writeFile(htmlFileName, html, error => {
    if (error) throw error

    console.log(`CREATED pug -> html: ${htmlFileName}`)
  })
}

const compile = filename => {
  const option = Object.assign(defaultOption, {
    filePath: path.relative(docRoot, filename)
  })

  return new Promise((resolve, reject) => {
    pug.renderFile(filename, option, (error, html) => {
      if (error) {
        reject(error)
        throw error
      }

      console.log('-----------------------------------')
      console.log(`////// ${filename} //////`)
      console.log(HTMLHint.verify(html))
      console.log('-----------------------------------')
      resolve(html)
    })
  })
}

const exec = () => {
  const files = glob.sync(`${docRoot}/**/*.pug`)

  files.forEach(file => {
    renderPug(file)
  })
}

// middleware for browsersync
module.exports = {
  exec,
  regexp,
  middleware: async (req, res, next) => {
    const requestPath = url.parse(req.url).pathname
    const filePath = path.join(docRoot, requestPath.replace(/\.html$/, '.pug'))

    if (!fs.pathExistsSync(filePath) || !(/\.html$/.test(requestPath))) {
      next()
      return
    }

    console.log(`pug compile: ${requestPath}`)

    const html = await compile(filePath)

    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(html)
    next()
  }
}
