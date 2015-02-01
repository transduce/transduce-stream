## Transduce Stream
[![Build Status](https://secure.travis-ci.org/transduce/transduce-stream.svg)](http://travis-ci.org/transduce/transduce-stream)

Transform Node.js streams with transducers.

Works with [transducers-js][3] or [transducers.js][4] or [transduce][5].

```javascript
var stream = require('transduce-stream')

var transducer = // create transducer with transduce, transducers-js or transducers.js

process.stdin.resume()
process.stdin.pipe(stream(transducer)).pipe(process.stdout)
```

Example:

```javascript
var stream = require('./'),
    tr = require('transduce') // or transducers-js or transducers.js

var trans = tr.compose(
  tr.string.words(),
  tr.map(function(x){return (+x * +x) + ' '}),
  tr.array.push('\n'))

process.stdin.resume()
process.stdin.pipe(stream(trans)).pipe(process.stdout)
```

Run to get the squares of numbers passed on `stdin`.

```
$ echo '1 12 7 41' | node square.js
1 144 49 1681
```

This example makes use of [transduce/array][1] to add a new line at the end of the stream and [transduce/string][2] to split the input on words (can also split on lines, chars and separators or RegExps).

Or using [underscore-transducer][6].

```javascript
// test.js
var _r = require('underscore-transducer')
    stream = require('transduce-stream')

var transducer = _r()
  .words()
  .map(function(x){return (+x * +x)+ ' '})
  .uniq()
  .take(4)
  .push('\n')
  .compose()

process.stdin.resume()
process.stdin.pipe(stream(transducer)).pipe(process.stdout)
```

Run this from the terminal to calculate a formatted sequence of the first 4 unique squared values.

```bash
$ echo '33 27 33 444' | node test.js
 1089  729  197136

$ node test.js << EOT
12 32
33 33
33 43
12 33 12
EOT
 144  1024  1089  1849
```


[1]: https://github.com/transduce/transduce#array
[2]: https://github.com/transduce/transduce#string
[3]: https://github.com/cognitect-labs/transducers-js
[4]: https://github.com/jlongster/transducers.js
[5]: https://github.com/transduce/transduce
[6]: https://github.com/kevinbeaty/underscore-transducer
