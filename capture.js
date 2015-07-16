
var _ = require('lodash')
var fs = require('fs.extra')
var path = require('path')
var moment = require('moment')
var screenshot = require('node-webkit-screenshot')

var manifest = require('./manifest.json')

function capture(url, opts) {
  opts = _.defaults(opts || {}, {
    width: 1536,
    height: 1152,
    delay: 1
  })

  var timestamp = moment().format('-YYYY-MM-DD-hh-mm-ss');
  var filename = [
    'Screenshot',
    url
      .replace(/^(http\:\/\/||https\:\/\/)/g, '')
      .replace(/\//g, '-'),
    timestamp
  ].join('-')

  console.log('Capturing screenshot from ' + url + '...')
  console.log(
    'width: ',
    opts.width,
    'height: ',
    opts.height,
    'delay: ',
    opts.delay
  )

  screenshot({
    url: url,
    width: opts.width,
    height: opts.height,
    delay: opts.delay
  })
  .then(function(buffer) {
    console.log('Saving image:', filename + '.png')
    manifest.captures = manifest.captures || []
    manifest.captures.push(filename)
    fs.writeFileSync('manifest.json', JSON.stringify(manifest))
    fs.writeFile(path.join(__dirname, './captures/' + filename + '.png'), buffer, function(error) {
      if (error) console.error(error)
      else console.log('Screenshot saved')
      screenshot.close()
    })
  })

}

var args = process.argv

var url = args[2]

if (url.match(/^http/)) {
  capture(url)
}

console.log('screenshot', args[2])

