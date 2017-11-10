// Load modules


var Lab = require('lab');
var Server = require('../lib');
var Path = require('path');

// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
const expect = lab.expect;
var it = lab.test;


describe('/ops/healthcheck', function () {

  it('returns ok', function (done) {

    Server.init(internals.manifest, internals.composeOptions, function (err, server) {

      expect(err).to.not.exist();

      server.inject('/ops/healthcheck', function (res) {

        expect(res.statusCode).to.equal(200);
        expect(res.result).to.equal({ message: 'ok' });

        server.stop(done);
      });
    });
  });
});

internals.manifest = {
  connections: [
    {
      port: 0
    }
  ],
  registrations: [
    {
      plugin: './healthcheck'
    }
  ]
};

internals.composeOptions = {
  relativeTo: Path.resolve(__dirname, '../lib/api')
};
