## Transduce Stream

Transform streams with [underscore-transducer][1] and [transduce-string][2].

```javascript
// test.js

var _r = require('transduce-stream');

var stream = _r()
  .invoke('toString')
  .map(function(x){return (+x * +x)})
  .numberFormat(2)
  .insert(0, 'squared: ')
  .surround('\n')
  .take(4)
  .stream();

process.stdin.resume();
process.stdin.pipe(stream).pipe(process.stdout);
```

```
transduce-stream $ node test.js
33

squared: 1,089.00
55

squared: 3,025.00
77

squared: 5,929.00
173

squared: 29,929.00
```

[1]: https://github.com/kevinbeaty/underscore-transducer
[2]: https://github.com/kevinbeaty/transduce-string
