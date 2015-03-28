var express = require('express')
var ffmpeg = require('fluent-ffmpeg')
var app = express()

require('heroku-self-ping')(process.env.APP_URL)

app.get('/', function (req, res) {
  var ytdl = require('ytdl-core')

  var url = req.query.url

  if(url == undefined){
    res.send('Hello World!')
  }else{
    var stream = ytdl(url, {filter: "audioonly"})

    console.info("Starting processing on \"" + url + "\"")
    stream.on("info",function(info, format){
      console.info("Finished fetching info - \"" + info.title + "\"")
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Lenght': format.size,
        'X-Content-Duration': info.length_seconds,
        'Content-disposition': 'attachment; filename="' + info.title + '.mp3"'
      })

      ffmpeg(stream)
        .toFormat('mp3')
        .on('end', function() {
          console.log('Processing finished!')
        })
        .on('error', function(error){
          console.log('Error processing video: ' + error.message)
        })
        .pipe(res)
    })
  }
})


var port = process.env.PORT || 3000
var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Youtoyou listening at http://%s:%s', host, port)
})