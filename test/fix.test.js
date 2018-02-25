const path        = require('path');
const mocha       = require('mocha');
const expect      = require('chai').expect;
const Fix         = require(path.join(__dirname, '..', 'index'));
const testDataDir = path.join(__dirname, 'data');
const fs          = require('fs');

const load        = function(file) {
  return JSON.parse(fs.readFileSync(path.join(testDataDir, file+'.json')));
}

describe("GDAX Fix parser", function() {
  describe("open", function() {
    it("parses correctly", function() {
      var fix = new Fix();

      var data = load('open');
      fix.on('open', function(report) {
        expect(report.id).to.equal(data.open.id);
        expect(report.timestamp).to.equal(data.open.timestamp);
        expect(report.product_id).to.equal(data.open.product_id);
        expect(report.side).to.equal(data.open.side);
        expect(report.size).to.equal(data.open.size);
        expect(report.price).to.equal(data.open.price);
        expect(report.status).to.equal(data.open.status);
        expect(report.uuid).to.equal(data.open.uuid);
      });
      fix.parseReport({_fields: data.fix});
 
    });
  });

  describe("cancelled", function() {
     it("parses correctly", function() {
      var fix = new Fix();

      var data = load('cancelled');
      fix.on('cancelled', function(report) {
        expect(report.id).to.equal(data.cancelled.id);
        expect(report.timestamp).to.equal(data.cancelled.timestamp);
        expect(report.product_id).to.equal(data.cancelled.product_id);
        expect(report.side).to.equal(data.cancelled.side);
        expect(report.size).to.equal(data.cancelled.size);
        expect(report.filled).to.equal(data.cancelled.filled);
        expect(report.price).to.equal(data.cancelled.price);
        expect(report.status).to.equal(data.cancelled.status);
        expect(report.uuid).to.equal(data.cancelled.uuid);
      });
      fix.parseReport({_fields: data.fix});
 
     }); 
  });

  describe("filled", function() {
    it("parses correctly", function() {
      var fix = new Fix();

      var data = load('filled');
      fix.on('filled', function(report) {
        expect(report.id).to.equal(data.filled.id);
        expect(report.timestamp).to.equal(data.filled.timestamp);
        expect(report.product_id).to.equal(data.filled.product_id);
        expect(report.side).to.equal(data.filled.side);
        expect(report.filled).to.equal(data.filled.filled);
        expect(report.price).to.equal(data.filled.price);
        expect(report.status).to.equal(data.filled.status);
        expect(report.uuid).to.equal(data.filled.uuid);
      });
      fix.parseReport({_fields: data.fix});
 
    });  
  });

  describe("done", function() {
    it("parses correctly", function() {
      var fix = new Fix();

      var data = load('done');
      fix.on('done', function(report) {
        expect(report.id).to.equal(data.done.id);
        expect(report.timestamp).to.equal(data.done.timestamp);
        expect(report.product_id).to.equal(data.done.product_id);
        expect(report.side).to.equal(data.done.side);
        expect(report.filled).to.equal(data.done.filled);
        expect(report.price).to.equal(data.done.price);
        expect(report.status).to.equal(data.done.status);
        expect(report.uuid).to.equal(data.done.uuid);
      });
      fix.parseReport({_fields: data.fix});
 
    });  
  });

  describe("stopped", function() {
  
  });

  describe("rejected", function() {
    describe("insufficient funds", function() {
      it("parses correctly", function() {
        var fix = new Fix();

        var data = load('rejected_insufficient_funds');
        fix.on('rejected', function(report) {
          expect(report.id).to.equal(data.rejected.id);
          expect(report.timestamp).to.equal(data.rejected.timestamp);
          expect(report.product_id).to.equal(data.rejected.product_id);
          expect(report.side).to.equal(data.rejected.side);
          expect(report.filled).to.equal(data.rejected.filled);
          expect(report.price).to.equal(data.rejected.price);
          expect(report.status).to.equal(data.rejected.status);
          expect(report.reason).to.equal(data.rejected.reason);
          expect(report.uuid).to.equal(data.rejected.uuid);
        })
        
        var report = fix.parseReport({_fields: data.fix});
      });
    });
    describe("side missing", function() {
      it("parses correctly", function() {
        var fix = new Fix();


        var data = load('rejected_no_side');
        var report = fix.parseRejected({_fields: data.fix});
        expect(report.time.getTime()).to.equal(new Date(data.rejected.time).getTime());
        expect(report.timestamp).to.equal(data.rejected.timestamp);
        expect(report.reason.value).to.equal(data.rejected.reason.value);
        expect(report.field).to.equal(data.rejected.field);
        expect(report.reason_code).to.equal(data.rejected.reason_code);       
        expect(report.sequence).to.equal(data.rejected.sequence);       
      });
    });
    
    describe("amount missing", function() {
      it("parses correctly", function() {
        var fix = new Fix();


        var data = load('rejected_no_amount');
        var report = fix.parseRejected({_fields: data.fix});
        expect(report.time.getTime()).to.equal(new Date(data.rejected.time).getTime());
        expect(report.timestamp).to.equal(data.rejected.timestamp);
        expect(report.reason.value).to.equal(data.rejected.reason.value);
        expect(report.field).to.equal(data.rejected.field);
        expect(report.reason_code).to.equal(data.rejected.reason_code);       
        expect(report.sequence).to.equal(data.rejected.sequence);       
      });
    });

    describe("symbol missing", function() {
      it("parses correctly", function() {
        var fix = new Fix();


        var data = load('rejected_no_symbol');
        var report = fix.parseRejected({_fields: data.fix});
        expect(report.time.getTime()).to.equal(new Date(data.rejected.time).getTime());
        expect(report.timestamp).to.equal(data.rejected.timestamp);
        expect(report.reason.value).to.equal(data.rejected.reason.value);
        expect(report.field).to.equal(data.rejected.field);
        expect(report.reason_code).to.equal(data.rejected.reason_code);       
        expect(report.sequence).to.equal(data.rejected.sequence);       
      });
    });

    describe("price missing", function() {
      it("parses correctly", function() {
        var fix = new Fix();


        var data = load('rejected_no_price');
        var report = fix.parseRejected({_fields: data.fix});
        expect(report.time.getTime()).to.equal(new Date(data.rejected.time).getTime());
        expect(report.timestamp).to.equal(data.rejected.timestamp);
        expect(report.reason.value).to.equal(data.rejected.reason.value);
        expect(report.field).to.equal(data.rejected.field);
        expect(report.reason_code).to.equal(data.rejected.reason_code);       
        expect(report.sequence).to.equal(data.rejected.sequence);       
      });
    });

  });

  describe("changed", function() {
  
  });

  describe("order_status", function() {
    var fix = new Fix();

    var data = load('orderStatus');
    it("parses correctly", function() {
      
      var index = 0;
      var report = fix.parseReport({_fields: data[index].fix});
      expect(report.time.getTime()).to.equal(new Date(data[index].status.time).getTime());
      expect(report.timestamp).to.equal(data[index].status.timestamp);
      expect(report.product_id).to.equal(data[index].status.product_id);
      expect(report.side).to.equal(data[index].status.side);
      expect(report.size).to.equal(data[index].status.size);
      expect(report.price).to.equal(data[index].status.price);
      expect(report.status).to.equal(data[index].status.status);
    }); 

    it("parses correctly", function() {
      var index = 1;
      var report = fix.parseReport({_fields: data[index].fix});
      expect(report.time.getTime()).to.equal(new Date(data[index].status.time).getTime());
      expect(report.timestamp).to.equal(data[index].status.timestamp);
      expect(report.product_id).to.equal(data[index].status.product_id);
      expect(report.side).to.equal(data[index].status.side);
      expect(report.size).to.equal(data[index].status.size);
      expect(report.price).to.equal(data[index].status.price);
      expect(report.status).to.equal(data[index].status.status);
    }); 

    it("parses correctly", function() {
      var index = 2;
      var report = fix.parseReport({_fields: data[index].fix});
      expect(report.time.getTime()).to.equal(new Date(data[index].status.time).getTime());
      
      expect(report.timestamp).to.equal(data[index].status.timestamp);
      expect(report.product_id).to.equal(data[index].status.product_id);
      expect(report.side).to.equal(data[index].status.side);
      expect(report.size).to.equal(data[index].status.size);
      expect(report.price).to.equal(data[index].status.price);
      expect(report.status).to.equal(data[index].status.status);
    }); 

  });
});
