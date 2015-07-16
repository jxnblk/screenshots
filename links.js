
var fs = require('fs')
var config = require('./config.json')
var manifest = require('./manifest.json')

var links = manifest.uploads.map(function(file) {
  return [
    '- [',
    file,
  '](',
  config.s3path + file,
  ')'
  ].join('')
})

var md = [
  '# Links',
  '',
  links.join('\n'),
  '',
].join('\n')

fs.writeFileSync('LINKS.md', md)

