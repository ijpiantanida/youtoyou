var express = require('express')
var app = express()

app.get('/', function (req, res) {
  var ytdl = require('ytdl-core');

  var url = req.query.url || 'http://www.youtube.com/watch?v=A02s8omM_hI';

  var stream = ytdl(url, {filter: "audioonly"});
  stream.on("info",function(info, format){ 
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Lenght': format.size,
      'X-Content-Duration': info.length_seconds,
      'Content-disposition': 'attachment; filename="' + info.description + '"'
    });
    stream.pipe(res);
  });
})

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Youtoyou listening at http://%s:%s', host, port);
})