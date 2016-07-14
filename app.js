'use strict';

module.exports = function(app) {
  app.config.coreMiddleware.push('session');
};
