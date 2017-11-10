// Load modules

const Hapi = require('hapi');

const Lab = require('lab');
const Server = require('../lib');
const Version = require('../lib/api/version');
const Path = require('path');

//declare internals

const internals = {};

// Test shortcuts

const lab = exports.lab = Lab.script();
const expect = lab.expect;
const it = lab.test;


it('starts server and returns hapi server object', function (done) {

  Server.init({}, {}, function (err, server) {

    expect(err).to.not.exist();
    expect(server).to.be.instanceof(Hapi.Server);

    server.stop(done);
  });
});

it('starts server on provided port', function (done) {

  Server.init({ connections: [{ port: 3000 }] }, {}, function (err, server) {

    expect(err).to.not.exist();
    expect(server.info.port).to.equal(3000);

    server.stop(done);
  });
});

it('handles register plugin errors', { parallel: false }, function (done) {

  const orig = Version.register;
  Version.register = function (server, options, next) {

    Version.register = orig;
    return next(new Error('register version failed'));
  };

  Version.register.attributes = {
    name: 'fake version'
  };

  Server.init(internals.manifest, internals.composeOptions, function (err, server) {

    expect(err).to.exist();
    expect(err.message).to.equal('register version failed');

    done();
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
