'use strict';

exports.get = function* (ctx) {
  ctx.body = ctx.session;
};

exports.set = function* (ctx) {
  ctx.session = ctx.query;
  ctx.body = ctx.session;
};
