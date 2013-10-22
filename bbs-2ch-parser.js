(function(global) {
  'use strict'


  var inherit = Object.create || function(p) {
    function f() {};
    f.prototype = p;
    return new f();
  }


  function unescape(str) {
    return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  }


  function parseDate(str) {
    var d = str.match(/\d+/g);
    return new Date(d[0], d[1] - 1, d[2], d[3], d[4], d[5] || 0, (d[6] || 0) * 10)
  }


  function LineParser() {
    this._lastLine = '';
  }
  LineParser.prototype.write = function(str) {
    var lines = str.toString().split('\n'), result = [], parsed;
    if (lines.length > 0) {
      lines[0] = this._lastLine + lines[0];
      this._lastLine = lines.pop();
    }
    for (var i = 0, n = lines.length; i < n; i++) {
      if ((parsed = this._parse(lines[i]))) {
        result.push(parsed);
      }
    }
    return result;
  }
  LineParser.prototype.end = function() {
    var result = [], parsed;
    if (this._lastLine.length !== 0 && (parsed = this._parse(this._lastLine))) {
      result.push(parsed);
    }
    this._lastLine = '';
    return result;
  }
  LineParser.prototype.parse = function(str) {
    return this.write(str).concat(this.end());
  }


  function MenuParser() {
    LineParser.call(this);
    this._category = null;
  }
  MenuParser.prototype = inherit(LineParser.prototype);
  MenuParser.prototype._parse = function(line) {
    var m;
    if (m = line.match(/^<A HREF=(http:\/\/[^\/]+\/[^\/]+\/)>(.*)<\/A><br>/)) {
      return {
        url: m[1],
        title: m[2],
        category: this._category
      };
    } else if (m = line.match(/^<BR><BR><B>(.*)<\/B><BR>/)) {
      this._category = m[1];
    }
  }


  function SubjectParser() {
    LineParser.call(this);
  }
  SubjectParser.prototype = inherit(LineParser.prototype);
  SubjectParser.prototype._parse = function(line) {
    var m;
    if (m = line.match(/^(\d+)\.dat<>(.*)\((\d+)\)$/)) {
      return {
        id: parseInt(m[1]),
        title: m[2],
        count: parseInt(m[3])
      };
    }
  }


  function DatParser() {
    LineParser.call(this);
  }
  DatParser.prototype = inherit(LineParser.prototype);
  DatParser.prototype._parse = function(line) {
    var tok = line.split('<>');
    var dateid = tok[2].split(' ID:');
    var result = {
      name: tok[0],
      mail: tok[1],
      dtid: tok[2],
      body: tok[3]
    };
    if (tok[4]) {
      result.title = tok[4];
    }
    return result;
  }


  global.bbs2ch = global.bbs2ch || {};

  global.bbs2ch.parser = {
    MenuParser: MenuParser,
    SubjectParser: SubjectParser,
    DatParser: DatParser
  }

  if (typeof module !== 'undefined') {
    module.exports = global.bbs2ch.parser;
  }
})(this.self || global);
