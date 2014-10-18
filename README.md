## Transduce Stream

Transform node.js streams with transducers.

```javascript
var stream = require('transduce-stream');

var transducer = // create transducer with transducers-js or transducers.js

process.stdin.resume();
process.stdin.pipe(stream(transducer)).pipe(process.stdout);
```
