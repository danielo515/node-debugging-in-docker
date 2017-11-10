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


describe('/ops/version', function () {

  it('returns the version from package.json', function (done) {

    Server.init(internals.manifest, internals.composeOptions, function (err, server) {

      expect(err).to.not.exist();

      server.inject('/ops/version', function (res) {

        expect(res.statusCode).to.equal(200);
        expect(res.result).to.equal({ version: process.env.npm_package_version });

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
      plugin: './version'
    }
  ]
};

internals.composeOptions = {
  relativeTo: Path.resolve(__dirname, '../lib/api')
};
