var _                  = require('underscore');
var klass              = require('klass');
var os                 = require('os');
var path               = require('path');
var crypto             = require('crypto');
var fix                = require('fixjs');
var tls                = require('tls');
var url                = require('url');
var uuid               = require('uuid');
var Message            = fix.Msgs;
var EventEmitter       = require('events');

module.exports         = klass(function(options) {
  _.extend(this, options);
  var self             = this;
  
  this.events          = new EventEmitter();

  if (this.verbose == undefined) {
    this.verbose = false;
  }
 
  if (this.host == undefined) {
    this.host = 'fix.gdax.com';
  }
  
  if (this.port == undefined) {
    this.port = '4198';
  }

  this.addEvents();

}).methods({

  addEvents: function() {
    var self = this;
    this.on('transport:reject', function(message) {
      self.parseRejected(message);
    })

    this.on('parsed:rejected', function(report) {
      self.emit('reject', report);
    })

    this.on('parsed:report', function(report) {
      self.emit(report.status, report);
    })

    this.on('done', function(report) {

    })

    this.on('changed', function(report) {
    })

    this.on('open', function(report) {

    })

    this.on('cancelled', function(report) {

    })

    this.on('filled', function(report) {

    })
  },

  connect: function() {
    var self = this;

    this.stream   = tls.connect({
      host: this.host, 
      port: this.port
    }, function(err) {
      self.emit('stream:connected', err);
    });

    this.stream.on('error', function(err) {
      self.emit('stream:error', err);
    });

    this.client    = fix.createClient(this.stream);
    this.transport = this.client.session(this.key, 'Coinbase');

    this.transport.on('logon', function(message) {
      self.emit('transport:login', message);   
    });

    this.transport.on('TestRequest', function(message, next) {
      self.emit('transport:test', message._fields);   
      next();
    });

    this.transport.on('ExecutionReport', function(message, next) {
      self.emit('transport:execution_report', message);
      self.parseReport(message);
      next();
    });

    this.transport.on('Heartbeat', function(message, next) {
      self.emit('transport:heartbeat', message);
      next();
    });


    this.transport.on('OrderCancelReject', function(message, next) {
      self.emit('transport:order_cancel_rejected', message);
      next();
    });

    this.transport.on('Reject', function(message, next) {
      self.emit('transport:reject', message);
      next();
    });

    this.transport.on('send', function(message) {
      self.emit('transport:send', message);
    });

    this.transport.on('error', function(err) {
      self.emit('transport:error', err);
    });

    this.transport.on('logout', function() {
      self.emit('transport:logout');
    });

    this.transport.on('end', function() {
      self.emit('transport:end');
    });

    this.stream.on('end', function() {
      self.emit('stream:end');
    });

    this.logon();
  },

  logEvent: function(name, report) {
    if (this.verbose) {
      if (report != undefined) {
        if (name.indexOf('transport') > -1) {
          console.log(name+":"+report.name);
          if (report.name == 'Error') {
            console.log(report);
          } else {
            console.log(report._fields);
          }
        } else {
          console.log(name);
          console.log(report)
        }
      }
    }
  },

  parseExecType: function(field) {
    
    switch(field) {
      case '0':
        return 'open';
      case '1':
        return 'filled';
      case '3': 
        return 'done';
      case '4': 
        return 'cancelled';
      case '7': 
        return 'stopped';
      case '8': 
        return 'rejected';
      case 'D': 
        return 'changed';
      case 'I': 
        return 'order_status';
    }
  },

  parseTime: function(field) {
    return new Date(field.substring(0,4)+"-"+
                    field.substring(4,6)+'-'+
                    field.substring(6,8)+'T'+
                    field.substring(9,21)+"Z");
  },

  parseOrderType: function(field) {
    switch(field) {
      case '1':
        return 'market';
      case '2':
        return 'limit';
      case '3': 
        return 'stop';
    }
  },
  
  parseSide: function(field) {
    switch(field) {
      case 'sell':
        return 'sell';
      case 'buy':
        return 'buy';
      case '1':
        return 'buy';
      case '2':
        return 'sell';
    }
  },

  parseReason: function(field) {
    switch(field) {
      case '5':
        return 'value_incorrect';
      case '1': 
        return 'missing';
      case '11':
        return 'type';
      case '6':
        return 'format';
    }    
  },

  parseIncorrectField: function(field) {
    switch(field) {
      case '38': 
        return 'amount';
      case '55':
        return 'symbol';
      case '54': 
        return 'side';
      case '44':
        return 'price';
    }   
  },

  formatErrorMessage: function(message) {
    if (message.indexOf(':') > -1) {
      var parsed = message.match("Invalid (.+)\: (.+)");
      if (parsed && parsed[2] != undefined) { 
        return { value: parsed[2] };
      } else {
        return message;
      }
    } else {
      return message.split(' ').join('_').toLowerCase();
    }
  },

  hasField: function(message, field) {
    return message._fields[field.toString()] != undefined;
  },

  field: function(message, number) {
    return message._fields[number.toString()];
  },

  parseRejected: function(message, report) {
    if (report == undefined) {
      report = {};
    }  
    if (this.hasField(message, 52)) {
      report.sending_time = this.parseTime(this.field(message, 52));;
      if (report.time == undefined) {
        report.time = report.sending_time;
      }
      report.timestamp = report.time.getTime();
    }
    if (this.hasField(message, 45)) {
      report.sequence = parseInt(this.field(message, 45));
    }
    if (this.hasField(message, 58)) {
      report.reason = this.formatErrorMessage(this.field(message, 58));
    }
    if (this.hasField(message, 371)) {
      report.field = this.parseIncorrectField(this.field(message, 371));
    }
    if (this.hasField(message, 373)) {
      report.reason_code = this.parseReason(this.field(message, 373));
    }

    this.emit('parsed:rejected', report);
    return report;
  },

  parseReport: function(message) {
    var report = {}
    if (this.hasField(message, 37)) {
      report.id = this.field(message, 37);
    }
    
    if (this.hasField(message, 60)) {
      report.time = this.parseTime(this.field(message, 60));
    }
  
    if (this.hasField(message, 55)) {
      report.product_id =   this.field(message, 55);
    }
    
    if (this.hasField(message, 40)) {
      report.type =       this.parseOrderType(this.field(message, 40));
    }
    
    if (this.hasField(message, 54)) {
      report.side =        this.parseSide(this.field(message, 54));
    }

    if (this.hasField(message, 44)) {
      report.price =        parseFloat(this.field(message, 44));
    }
    
    if (this.hasField(message, 39)) {
      report.status =       this.parseExecType(this.field(message, 39));
    }

    if (report.status == 'open') {
      report.size = parseFloat(this.field(message, 38));
      if (this.field(message, 1057) == 'N') {
        report.aggressor = false;
      }
      if (this.field(message, 1057) == 'Y') {
        report.aggressor = true;
      }

      if (this.hasField(message, 52)) {
        report.sending_time = this.parseTime(this.field(message, 52));
      }
    } 

    if (report.status == 'rejected') {
      _.extend(report, this.parseRejected(message, report))
    } 

    if (report.status == 'cancelled') {
      report.filled = (this.hasField(message, 32) ? parseFloat(this.field(message, 32)) : 0);
      report.size = parseFloat(this.field(message, 38));
    } 

    if (report.status == 'filled') {
      report.filled = parseFloat(this.field(message, 32));
      report.size = report.filled;
      if (this.field(message, 1057) == 'N') {
        report.aggressor = false;
      }

      if (this.field(message, 1057) == 'Y') {
        report.aggressor = true;
      } 
    } 
    if (this.hasField(message,11)) {
      report.uuid      = this.field(message, 11); 
    }
    if (this.hasField(message,137)) {
      report.fee       = parseFloat(this.field(message, 137)); 
    }
    if (this.hasField(message, 1003)) {
      report.trade_id  = parseFloat(this.field(message, 1003)); 
    }

    if (report.time != undefined) {
      report.timestamp = report.time.getTime();
    }

    if (this.hasField(message, 150)) {
      if (this.field(message, 150) && report.id == '0') {
        report.status = 'order_status';
        report.orders = [];
      }
    }

    this.emit('parsed:report', report);
    return report;
  },


  on: function(e, f) {
    this.events.on(e, f);
  },
  
  emit: function(e, d) {
    this.logEvent('emit:'+e, d);
    this.events.emit(e, d);
  },

  logout: function() {
    this.transport.logout()
  },

  logon: function() {
    function sign(params, secret) {
      var key       = Buffer(secret, 'base64');
      var hmac      = crypto.createHmac('sha256', key);
      var signature = hmac.update(params).digest('base64');
      return signature;
    }

    var message = new Message.Logon();
    message.SendingTime   = new Date();
    message.set(108, 30);
    message.set(98, 0);
    message.set(554, this.passphrase);

    var presign = [
      message.SendingTime,
      message.MsgType,
      this.transport.outgoing_seq_num,
      this.transport.sender_comp_id,
      this.transport.target_comp_id,
      this.passphrase
    ];

    var what              = presign.join('\x01');
    message.set(96, sign(what, this.secret));
    this.transport.send(message, true);
  },

  sendOrder: function(options) {
    if (options.type == undefined) {
      options.type = 2;
    }
    options.uuid       = uuid();
    if (options.amount != undefined) {
      var size           = parseFloat(options.amount.toFixed(5));
    }
    var order          = new Message.NewOrderSingle();
    order.set(55, options.symbol);
    order.set(11, options.uuid);
    order.set(54, options.side);
    order.set(21, 1);
    order.set(60, new Date());
    order.set(40, options.type);
    order.set(38, size);
    order.set(44, options.price);
    order.set(59, '1');
    order.set(7928, 'D');
    this.transport.send(order);
    return options;
  },

  cancelOrder: function(options) {
    var cancel     = new Message.OrderCancelRequest();
    cancel.set(55, options.symbol);

    if (options.uuid != undefined) {
      cancel.set(41, options.uuid);
    }
    
    if (options.order_id != undefined) {
      cancel.set(37, options.order_id);
    }
    
    this.transport.send(cancel);
  },

  orderStatus: function() {
    var orders     = new Message.OrderStatusRequest();
    orders.set(37,'*');
    this.transport.send(orders);
  },

  test: function(message) {
    var testMessage       = new Message.TestRequest();
    testMessage.set(112, message);
    this.transport.send(testMessage);
  }

})

