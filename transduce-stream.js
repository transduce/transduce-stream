var _r = require('transduce-string'),
    util = require('util'),
    Transform = require('stream').Transform,
    transform, stream;

module.exports = _r;

util.inherits(TransduceStream, Transform);
function TransduceStream(transducer, options){
  if(!(this instanceof TransduceStream)){
    return new TransduceStream(transducer, options);
  }
  Transform.call(this, options);

  this._transformCallback = transformCallback(this, transducer);
}

TransduceStream.prototype._transform = function(chunk, enc, cb){
  var result = this._transformCallback(null, chunk);
  cb();
}

TransduceStream.prototype._flush = function(cb){
  this._transformCallback();
  cb();
}

function transformCallback(stream, transducer){
  return _r(null, transducer)
    .each(function(item){stream.push(item)})
    .asyncCallback(function(err){
      if(err){
        stream.emit('error', err);
      }
      stream.end();
    });
}

_r.stream = TransduceStream;
_r.prototype.stream = function(options){
  return _r.stream(this, options);
}
