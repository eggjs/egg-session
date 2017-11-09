'use strict';

exports.get = function* (ctx) {
  ctx.body = ctx.session;
};

exports.set = function* (ctx) {
  ctx.session = ctx.query;
  ctx.body = ctx.session;
};

exports.setKey = function* (ctx) {
  ctx.session.key = ctx.query.key;
  ctx.body = ctx.session;
};

exports.remove = function* (ctx) {
  ctx.session = null;
  ctx.body = ctx.session;
};

exports.maxAge = function* (ctx) {
  ctx.session.maxAge = Number(this.query.maxAge);
  ctx.body = ctx.session;
};
