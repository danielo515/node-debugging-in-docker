'use strict';

const _ = require('lodash');
const addApi = (values) => (isApi) => isApi ? values.concat('api') : values;


module.exports.hiphenate = ({ text }) => _.snakeCase(text);
module.exports.makeTags = (...names) => addApi(names)