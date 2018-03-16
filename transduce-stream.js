"use strict"
var util = require('util'),
    Transform = require('readable-stream').Transform

module.exports = TransduceStream

var streamTransformer = {}
streamTransformer['@@transducer/init'] = function(){}
streamTransformer['@@transducer/step'] = function(stream, item){
    if(!stream._destroyed){
      stream.push(item)
    }
    return stream
  }
streamTransformer['@@transducer/result'] = function(stream){return stream}

util.inherits(TransduceStream, Transform)
function TransduceStream(transducer, options){
  if(!(this instanceof TransduceStream)){
    return new TransduceStream(transducer, options)
  }
  Transform.call(this, options)

  this._transformXf = transducer(streamTransformer)
}

TransduceStream.prototype._transform = function(chunk, enc, cb){
  if(!this._destroyed){
    var stream = this._transformXf['@@transducer/step'](this, chunk)
    if(stream && stream['@@transducer/reduced']){
      this._transformXf['@@transducer/result'](this)
      this.destroy()
    }
  }
  cb()
}

TransduceStream.prototype._flush = function(cb){
  if(!this._destroyed){
    this._transformXf['@@transducer/result'](this)
    this.destroy()
  }
  cb()
}

// from https://github.com/rvagg/through2
TransduceStream.prototype.destroy = function(err){
  if(!this._destroyed){
    this._destroyed = true

    var self = this
    process.nextTick(function(){
      if(err) self.emit('error', err)
      self.end()
    })
  }
}
