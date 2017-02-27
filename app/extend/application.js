'use strict';

const assert = require('assert');

module.exports = {
  /**
   * set session external store
   * @param  {Object} store session store instance with get/set/destory methods
   */
  set sessionStore(store) {
    assert(typeof store.get === 'function', 'store.get must be function');
    assert(typeof store.set === 'function', 'store.set must be function');
    assert(typeof store.destroy === 'function', 'store.destroy must be function');
    this.config.session.store = store;
  },
};
