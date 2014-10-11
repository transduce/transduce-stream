## Transduce Stream

Transform streams with [underscore-transducer][1].

```javascript
var _r = require('transduce-stream');

var stream = _r()
  .invoke('toString')
  .map(function(x){return (+x * +x)+'\n'})
  .take(4)
  .stream();

process.stdin.resume();
process.stdin.pipe(stream).pipe(process.stdout);
```

[1]: https://github.com/kevinbeaty/underscore-transducer
