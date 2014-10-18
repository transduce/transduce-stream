## Transduce Stream

Transform node.js streams with transducers.

Works with [transducers-js][3] or [transducers.js][4] or any library conforming to [transduce-protocol][5].

```javascript
var stream = require('transduce-stream');

var transducer = // create transducer with transducers-js or transducers.js

process.stdin.resume();
process.stdin.pipe(stream(transducer)).pipe(process.stdout);
```

Example:

```javascript
var stream = require('transduce-stream'),
    string = require('transduce-string'),
    array = require('transduce-array'),
    transducers = require('transducers-js');

var trans = transducers.comp(
  string.words(),
  transducers.map(function(x){return (+x * +x) + ' '}),
  array.push('\n'));

process.stdin.resume();
process.stdin.pipe(stream(trans)).pipe(process.stdout);
```

Run to get the squares of numbers passed on `stdin`.

```
$ echo '1 12 7 41' | node square.js
1 144 49 1681
```

This example makes use of [transduce-array][1] to add a new line at the end of the stream and [transduce-string][2] to split the input on words (can also split on lines, chars and separators or RegExps).

[1]: https://github.com/transduce/transduce-array
[2]: https://github.com/transduce/transduce-string
[3]: https://github.com/cognitect-labs/transducers-js
[4]: https://github.com/jlongster/transducers.js
[5]: https://github.com/transduce/transduce-protocol
[6]: https://github.com/kevinbeaty/underscore-transducer
[7]: http://simplectic.com/projects/underscore-transducer/
