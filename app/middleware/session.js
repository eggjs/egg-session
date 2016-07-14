'use strict';

module.exports = function(options, app) {
  return require('koa-session')(options, app);
};
