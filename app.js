'use strict';

const assert = require('assert');

module.exports = function(app) {
  app.config.coreMiddleware.push('session');

  app.session = {
    /**
     * set session external store
     *
     * ```js
     * app.session.use({
     *   * get() {},
     *   * set() {},
     *   * destory() {},
     * });
     *
     * @param  {Object} store session store instance
     */
    use(store) {
      assert(typeof store.get === 'function', 'store.get must be function');
      assert(typeof store.set === 'function', 'store.set must be function');
      assert(typeof store.destroy === 'function', 'store.destroy must be function');
      app.config.session.store = store;
    },
  };
};
