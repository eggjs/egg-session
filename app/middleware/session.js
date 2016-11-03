'use strict';

module.exports = (options, app) => {
  return require('koa-session')(options, app);
};
