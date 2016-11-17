'use strict';

module.exports = function(app) {
  app.get('/', function* () {
    this.session = {
      key: 'a'.repeat(3000),
    };
    this.body = this.session;
  });
};
