## Transduce Stream

Transform streams with [underscore-transducer][1] and [transduce-string][2].

```javascript
// test.js
var _r = require('transduce-stream');

var stream = _r()
  .words()
  .map(function(x){return (+x * +x)})
  .uniq()
  .numberFormat(2)
  .surround(' ')
  .take(4)
  .push('\n')
  .stream();

process.stdin.resume();
process.stdin.pipe(stream).pipe(process.stdout);
```
Run this from the terminal to calculate a formatted sequence of the first 4 unique squared values.

```bash
$ echo '33 27 33 444' | node test.js
 1,089.00  729.00  197,136.00

$ node test.js << EOT
12 32
33 33
33 43
12 33 12
EOT
 144.00  1,024.00  1,089.00  1,849.00
```

Functions that `split` over the String are processed lazily and as soon as possible: `lines`, `words` and `chars` will process a line/word/char as they are received, and buffer any intermediate chunks appropriately.

[1]: https://github.com/kevinbeaty/underscore-transducer
[2]: https://github.com/kevinbeaty/transduce-string
