
var _ = require('lodash')
var fs = require('fs.extra')
var gm = require('gm')
var path = require('path')
var manifest = require('./manifest.json')

function resize(filename, opts) {
  opts = _.defaults(opts || {}, {
    width: 800
  })

  var resizeOpts = Object.keys(opts)

  gm('captures/' + filename)
    .resize(opts.width, opts.height || null)
    .write('resized/' + filename.replace(/\.png$/, '-' + opts.width + '.jpg'), function(err) {
      if (err) {
        console.log(err)
      }
      manifest.resized = manifest.resized || []
      manifest.resized.push(filename)
      fs.writeFileSync('manifest.json', JSON.stringify(manifest))
      fs.move('captures/' + filename, 'archive/' + filename)
    })
}

var files = fs.readdirSync('captures')
  .filter(function(filename) {
    return !filename.match(/^\./)
  })

files.forEach(function(filename) {
  resize(filename, {})
})

