var _r = require('transduce-string'),
    util = require('util'),
    Transform = require('stream').Transform,
    transform, stream;

module.exports = _r;

util.inherits(TransduceStream, Transform);
function TransduceStream(transducer, options){
  var self = this;

  if(!(self instanceof TransduceStream)){
    return new TransduceStream(transducer, options);
  }
  Transform.call(self, options);

  self._transformCallback = _r(null, transducer)
    .each(function(item){self.push(item)})
    .asCallback();
}

TransduceStream.prototype._transform = function(chunk, enc, cb){
  var result = this._transformCallback(chunk);
  cb();
  if(result.done){
    this.end();
  }
}

TransduceStream.prototype._flush = function(cb){
  this._transformCallback();
  cb();
}

_r.stream = TransduceStream;
_r.prototype.stream = function(options){
  return _r.stream(this, options);
}
