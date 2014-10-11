## Transduce Stream

Transform streams with [underscore-transducer][1] and [transduce-string][2].

```javascript
// test.js
var _r = require('transduce-stream');

var stream = _r()
  .words()
  .map(function(x){return (+x * +x)})
  .numberFormat(2)
  .surround(' ')
  .stream();

process.stdin.resume();
process.stdin.pipe(stream).pipe(process.stdout);

```
$ echo '33 27 33 444' | node test.js
 1,089.00  729.00  1,089.00  197,136.00
```

[1]: https://github.com/kevinbeaty/underscore-transducer
[2]: https://github.com/kevinbeaty/transduce-string
