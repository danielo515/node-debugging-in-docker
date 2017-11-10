// Load modules
'use strict';

const Config = require('getconfig');
const Hoek = require('hoek');
const Server = require('./index');

// Declare internals

const internals = {};

internals.manifest = {
    connections: [
        {
            port: process.env.PORT || Config.server.port || 3000
        }
    ],
    registrations: [
        {
            plugin: 'inert'
        },
        {
            plugin: 'vision'
        },
        {
            plugin: 'lout'
        },
        {
            plugin: {
                register: 'hapi-swagger',
                options: {
                    info: {
                        title: 'An example service embeded into a docker container to make debugging practices',
                        version: process.env.npm_package_version
                    },
                    expanded: 'full',
                    jsonEditor: true,
                    pathPrefixSize: 2
                }
            }
        },
        {
            plugin: {
                register: 'good',
                options: {
                    reporters: {
                        consoleReporter: [
                            {
                                module: 'good-squeeze',
                                name: 'Squeeze',
                                args: [{ log: '*', response: '*', request: '*', error: '*' }]
                            },
                            {
                                module: 'good-console',
                                args: [{ format: 'MM/DD/Y hh:mm:ss' }]
                            }, 'stdout']
                    }
                }
            }
        },
        {
            plugin: './api/version'
        },
        {
            plugin: './api/healthcheck'
        }
    ]
};

internals.composeOptions = {
    relativeTo: __dirname
};

Server.init(internals.manifest, internals.composeOptions, (err, server) => {

    Hoek.assert(!err, err);
    server.log(process.env.npm_package_name + ' v' + process.env.npm_package_version + ' started at: ' + server.info.uri);
});
