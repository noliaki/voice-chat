const pugExec = require('./pug').exec
const stylExec = require('./stylus').exec
const copyExec = require('./cp-files').exec
const imageMinExec = require('./imagemin').exec

pugExec()
stylExec()
copyExec()
imageMinExec()
