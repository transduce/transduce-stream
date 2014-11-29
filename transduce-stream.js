"use strict";
var compose = require('transduce-compose'),
    push = require('transduce-push'),
    util = require('util'),
    Transform = require('stream').Transform,
    transform, stream;

module.exports = TransduceStream;

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
};

TransduceStream.prototype._flush = function(cb){
  this._transformCallback();
  cb();
};

function transformCallback(stream, transducer){
  var xf = compose(transducer, push.tap(function(result, item){stream.push(item);}));
  return push.asyncCallback(xf, stream.destroy.bind(stream));
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
};
