'use strict';

module.exports = app => {
  // set redis session store
  app.session.use({
    * get(key) {
      const res = yield app.redis.get(key);
      if (!res) return null;
      return JSON.parse(res);
    },

    * set(key, value, maxAge) {
      value = JSON.stringify(value);
      yield app.redis.set(key, value, 'PX', maxAge);
    },

    * destroy(key) {
      yield app.redis.del(key);
    },
  });
};
