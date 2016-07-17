'use strict';

module.exports = function(app) {
  app.get('/', app.controller.home);
  app.get('/clear', app.controller.clear);
};
