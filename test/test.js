var
http = require('http'),
iconv = require('iconv'),
b2parser = require('../bbs-2ch-parser.js');

http.get('http://toro.2ch.net/tech/subject.txt', function(res) {
  var sjis2utf8 = new iconv.Iconv('sjis', 'utf8//TRANSLIT//IGNORE');
  var parser = new b2parser.SubjectParser();
  res.pipe(sjis2utf8)
    .on('data', function(data) {
      console.log(parser.write(data));
    })
    .on('end', function() {
      console.log(parser.end());
    });
});
