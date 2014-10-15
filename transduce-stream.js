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
    .asyncCallback(stream.destroy.bind(stream));
}

// from https://github.com/rvagg/through2
TransduceStream.prototype.destroy = function(err){
  if(this._destroyed) return;
  this._destroyed = true;

  var self = this;
  process.nextTick(function(err){
    if(err) self.emit('error', err);
    self.emit('close');
  });
}

_r.stream = TransduceStream;
_r.prototype.stream = function(options){
  return _r.stream(this, options);
}

// Helper to pipe stream from stdin to stdout
// and wait for stdout to flush before exit
// stream is any node.js stream (use _r.stream to create)
_r.pipestdio = function(stream){
  process.stdin.pipe(stream).pipe(process.stdout);
  process.stdin.resume();

  process.on('exit', function(){
    process.stdout.once('drain', function(){
      process.exit(0);
    });
  });
}
