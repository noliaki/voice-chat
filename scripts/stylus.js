const stylus = require('stylus')
const autoprefixer = require('autoprefixer-stylus')
const fs = require('fs-extra')
const path = require('path')
const glob = require('glob')
const url = require('url')

const src = require('./config').src
const dist = require('./config').dist
const docRoot = require('./config').docroot

const regexp = /\.styl$/

const browsers = [
  'ie >= 6'
]

const convertStylus = async filename => {
  const css = await compile(filename)

  writeFile(filename, css)
}

const compile = filename => {
  const str = fs.readFileSync(filename, {
    encoding: 'utf8'
  })

  return new Promise((resolve, reject) => {
    stylus(str)
      .include(`${src}/modules/stylus`)
      .use(autoprefixer({
        browsers
      }))
      .set('compress', true)
      .render((error, output) => {
        if (error) {
          reject(error)
          throw error
        }

        resolve(output)
      })
  })
}

function writeFile (filename, string) {
  const distPath = path.resolve(dist, path.relative(docRoot, filename))
  const cssFileName = distPath.replace(/\.styl$/, '.css')

  fs.ensureDirSync(path.dirname(distPath))

  fs.writeFile(cssFileName, string, error => {
    if (error) throw error

    console.log(`CREATED stylus -> css: ${cssFileName}`)
  })
}

const exec = () => {
  const files = glob.sync(`${docRoot}/**/*.styl`)

  files.forEach(file => {
    convertStylus(file)
  })
}

// middleware for browsersync
module.exports = {
  exec,
  regexp,
  middleware: async (req, res, next) => {
    const requestPath = url.parse(req.url).pathname
    const filePath = path.join(docRoot, requestPath.replace(/\.css$/, '.styl'))

    if (!(/\.css$/.test(requestPath)) || !fs.pathExistsSync(filePath)) {
      next()
      return
    }

    console.log(`stylus compile: ${requestPath}`)

    const css = await compile(filePath)

    res.writeHead(200, {'Content-Type': 'text/css'})
    res.end(css)
    next()
  }
}