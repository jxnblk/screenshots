
var fs = require('fs.extra')
var s3 = require('s3')
var path = require('path')
var manifest = require('./manifest.json')

function upload(filename) {
  var options = require('./config.json').s3
  var params = {
    localFile: path.join(__dirname, './resized', filename),
    s3Params: {
      Bucket: options.bucket,
      Key: 'basscss/assets/' + filename,
      //Key: 'basscss/' + version + '/basscss.min.css',
      ACL: 'public-read',
    }
  }

  var client = s3.createClient({
    s3Options: {
      accessKeyId: options.key,
      secretAccessKey: options.secret,
    }
  })

  var uploader = client.uploadFile(params)
  uploader.on('error', function(err) {
    console.error("unable to upload:", err.stack)
  })
  uploader.on('progress', function() {
    console.log("progress", uploader.progressMd5Amount, uploader.progressAmount, uploader.progressTotal)
  })
  uploader.on('end', function() {
    console.log("done uploading")
    manifest.uploads = manifest.uploads || []
    manifest.uploads.push(filename)
    fs.writeFileSync('manifest.json', JSON.stringify(manifest))
    fs.move('resized/' + filename, 'archive')
  })

}

var files = fs.readdirSync('resized')
  .filter(function(filename) {
    return !filename.match(/^\./)
  })

files.forEach(function(filename) {
  upload(filename)
})

