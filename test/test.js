"use strict"
var stream = require('../'),
    Readable = require('stream').Readable,
    Writable = require('stream').Writable,
    string = require('transduce/string'),
    tap = require('transduce/transducers/tap'),
    transduce = require('any-transduce'),
    test = require('tape')


function readArray(_source){
  var source = _source.concat(null),
      read = new Readable()
  read._read = function(){
      read.push(source.shift())
  }
  return read
}

function writeArray(t, expected){
  var write = new Writable(),
      arr = []
  write._write = function(chunk, enc, cb){
    arr.push(''+chunk)
    cb()
  }
  write.on('finish', function(){
    t.deepEqual(arr, expected)
  })
  return write
}

function pipe(trans, source, t, result){
  readArray(source).pipe(stream(trans)).pipe(writeArray(t, result))
}

test('Square', function(t) {
  t.plan(1)
  var trans = transduce.compose(
    string.words(),
    transduce.map(function(x){return (+x * +x)+' '}),
    string.words())
  pipe(trans, ['2 4', '  6 ', '8  1', '0 11'], t, ['4', '16', '36', '64', '100', '121'])
})


test('Strings: join', function(t) {
  t.plan(6)

  var trans = transduce.compose(
        string.join(''),
        tap(function(result, item){
          t.equal(item, 'foobar', 'basic join')
        }))
  readArray(['', 'foo', 'bar']).pipe(stream(trans))
  readArray(['', 'foo', 'bar']).pipe(stream(string.join(''))).pipe(writeArray(t, ['foobar']))
  pipe(string.join(''), ['', 'foo', 'bar'], t, ['foobar'])

  pipe(string.join(''), ['', 'foo', 'bar'], t, ['foobar'])
  pipe(string.join(' '), ['foo', 'bar'], t, ['foo bar'])
  pipe(string.join('1'), ['2', '2'], t, ['212'])
})

function lines(arr, t, expected, limit){
  return pipe(string.lines(limit), arr, t, expected)
}
test('lines', function(t) {
  t.plan(4)
  lines(['Hello World'], t, ['Hello World'])
  lines(['Hello\nWorld'], t, ['Hello', 'World'])
  lines(['\nH', 'el', 'lo\n', '\nW', 'orld\n'], t, ['Hello', 'World'])
  lines(['\nHello\n\nWorld\n'], t, ['Hello'], 2)
})

function words(arr, t, expected, sep){
  return pipe(string.words(sep), arr, t, expected)
}
test('words', function(t) {
  t.plan(5)
  words(['I love you!'], t, ['I', 'love', 'you!'])
  words([' I  ', '  love   you! ',' '], t, ['I', 'love', 'you!'])
  words(['I_love_you!'], t, ['I', 'love', 'you!'], '_')
  words(['I-', 'love', '-you!'], t, ['I', 'love', 'you!'], /-/)
  words([' ','  '], t, [])
})
