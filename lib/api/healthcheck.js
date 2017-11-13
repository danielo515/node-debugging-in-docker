'use strict';

const Util = require('../../lib/util/../uti');

exports.register = function (server, options, next) {

    server.route({
        path: '/ops/healthcheck',
        method: 'GET',
        config:{ 
            tags:Util.makeTags('ops')(true)
        },
        handler(request, reply) {

            reply({ message: 'ok' });
        }
    });

    next();
};

exports.register.attributes = {
    name: 'healthcheck'
};
