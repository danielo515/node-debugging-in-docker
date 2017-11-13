'use strict';
const Joi = require('joi');
const internals = {
    response: {
        version: process.env.npm_package_version
    }
};

const Util = require('../util');

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/ops/version',
        config: {
            description: 'Returns the version of the server',
            notes: 'Based on the package version',
            tags: Util.makeTags('meta', 'ops'),
            response: {
                status: {
                    200: Joi.object()
                }
            },
            handler(request, reply) {

                return reply(internals.response);
            }
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'version'
};
