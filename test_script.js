
var keys = {
  "key": "",
  "secret": "",
  "passphrase": "",
  "host": "fix.gdax.com",
  "port": "4198"
}


var Fix = require('./index');
var fix = new Fix(keys);

fix.verbose = true;

fix.on('open', function(report) {

})

fix.on('cancelled', function(report) {

})

fix.on('done', function(report) {

})

fix.on('rejected', function(report) {

})

fix.connect();

setTimeout(function() {
  fix.sendOrder({symbol: 'BCH-BTC', side: 'sell', price: '0.15', amount: 0.46});
}, 1000);



