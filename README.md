gdax-fix
------------


Here is a FIX client for the gdax api.  It is a nice complement to the websocket client, and allows you to have similar speed and through a socket for your orders and for the tracking of the completion of orders.  I think that it might also show when an order is partially filled , but I don't have enough coins to test that, so I haven't done much to wrap that functionality.  I tried to make all the different events that are passed around available to the on function, and you can see what events happen by setting the verbose property to true.  I think that this would allow people to make a very nice client for algorithmic trading.  I tried to make this as minimal an implementation as possible so that it would be as useful as possible to the most people.  


Installation
------------
```bash
npm install gdax-fix --save
```

Usage
------------

```javascript
var options = {
  "key": "",
  "secret": "",
  "passphrase": "",
  "host": "fix.gdax.com",
  "port": "4198"
}


var Fix = require('gdax-fix');
var fix = new Fix(options);

fix.verbose = true;

fix.on('open', function(report) {
  console.log(report);
})

fix.on('cancelled', function(report) {
  console.log(report);
})

fix.on('done', function(report) {
  console.log(report);
})

fix.on('rejected', function(report) {
  console.log(report);
})

fix.connect();

setTimeout(function() {
  fix.sendOrder({symbol: 'ETH-BTC', side: 'sell', price: '0.08775', amount: 0.12615});
}, 1000);

```




Contributing
------------

If you'd like to contribute a feature or bugfix: Thanks! To make sure your fix/feature has a high chance of being included, please read the following guidelines:

1. Post a [pull request](https://github.com/ballantyne/gdax-fix/compare/).
2. Make sure there are tests! We will not accept any patch that is not tested.
   It's a rare time when explicit tests aren't needed. If you have questions
   about writing tests for paperclip, please open a
   [GitHub issue](https://github.com/ballantyne/gdax-fix/issues/new).


And once there are some contributors, then I would like to thank all of [the contributors](https://github.com/ballantyne/gdax-fix/graphs/contributors)!


License
-------

It is free software, and may be redistributed under the terms specified in the MIT-LICENSE file.

Copyright
-------
© 2018 Scott Ballantyne. See LICENSE for details.
