'use strict';

const compose = require('koa-compose');

module.exports = (options, app) => {
  const cookieSessionMatchKey = `${options.key}=`;
  return compose([
    function* checkCookieLength(next) {
      yield next;
      const setCookie = this.response.headers['set-cookie'];
      if (!setCookie) {
        return;
      }
      for (const val of setCookie) {
        // http://browsercookielimits.squawky.net/
        if (val.indexOf(cookieSessionMatchKey) === 0 && val.length > 4093) {
          const err = new Error(`Max cookie limit is 4093, but got ${val.length}`);
          err.name = 'CookieLimitExceedError';
          err.cookie = val;
          this.coreLogger.error(err);
          break;
        }
      }
    },
    require('koa-session')(options, app),
  ]);
};
