'use strict';

const sessions = {};

module.exports = app => {
  const store = {
    * get(key) {
      return sessions[key];
    },

    * set(key, value) {
      sessions[key] = value;
    },

    * destroy(key) {
      sessions[key] = undefined;
    },
  };

  app.sessionStore = store;
};
