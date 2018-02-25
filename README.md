gdax-fix
------------


Here is a FIX client for the gdax api.  It is a nice complement to the websocket client, and allows you to have similar speed and through a socket for your orders and for the tracking of the completion of orders.  I think that it might also show when an order is partially filled , but I don't have enough coins to test that, so I haven't done much to wrap that functionality.  I tried to make all the different events that are passed around available to the on function, and you can see what events happen by setting the verbose property to true.  I think that this would allow people to make a very nice client for algorithmic trading.  I have some backbone models that do the accounting, but I haven't included them in this package because I didn't know if everyone would want to use those.  Backbone also has events, so you can connect the cancel or filled events to track the changes of balance and then reorder.  I tried to make this as barebones as possible so that it would be as useful as possible to the most people.  

Usage
------------

```javascript
var options = {
  "key": "",
  "secret": "",
  "password": "",
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
  fix.sendOrder({symbol: 'BCH-BTC', side: 'sell', price: '0.15', amount: 0.46});
}, 1000);

```

Donations
------------

Here are a few addresses where you can send me bitcoins.  If this library helps you and you are feeling especially generous I know that you will feel compelled to buy me jianbing with magical internet money.  


* BTC: 1A1BrPyWpdXLPsidjaMAmyNG71vFwmKPSR
* BCH: qqhk5ce25fs706sk9vlnhtezpk3ezp9euc82cyky8v
* ETH: 0xC33DBB4D997e6A3d9457F41ff07fb13f8DA7bF64
* LTC: LS2P54xNErZ36pXp95zqTyST7XTx5XHEZy

Also, I learned a lot from this repo, https://github.com/Saurox/GDAX-Fix-Client/blob/master/index.js so maybe send that person a buck or two.


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
