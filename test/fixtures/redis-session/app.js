'use strict';

module.exports = app => {
  // set redis session store
  app.sessionStore = class Store {
    constructor(app) {
      this.app = app;
    }
    * get(key) {
      const res = yield this.app.redis.get(key);
      if (!res) return null;
      return JSON.parse(res);
    }

    * set(key, value, maxAge) {
      value = JSON.stringify(value);
      yield this.app.redis.set(key, value, 'PX', maxAge);
    }

    * destroy(key) {
      yield this.app.redis.del(key);
    }
  };
};
