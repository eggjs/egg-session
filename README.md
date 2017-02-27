# egg-session

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-session.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-session
[travis-image]: https://img.shields.io/travis/eggjs/egg-session.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-session
[codecov-image]: https://codecov.io/github/eggjs/egg-session/coverage.svg?branch=master
[codecov-url]: https://codecov.io/github/eggjs/egg-session?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-session.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-session
[snyk-image]: https://snyk.io/test/npm/egg-session/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-session
[download-image]: https://img.shields.io/npm/dm/egg-session.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-session

Session plugin for egg, based on [koa-session](https://github.com/koajs/session).

## Install

```bash
$ npm i egg-session --save
```

## Usage

egg-session is a build-in plugin in egg and enabled by default.

```js
// {app_root}/config/plugin.js
exports.session = true; // enable by default
```

### External Store

egg-session support external store, you can store your sessions in redis, memcached or other databases.

For example, if you want to store session in redis, you must:

1. dependent [egg-redis](https://github.com/eggjs/egg-redis)

  ```bash
  npm i --save egg-redis
  ```

  ```js
  // config/plugin.js
  exports.redis = {
    enable: true,
    package: 'egg-redis',
  };
  ```

  ```js
  // config/config.default.js
  exports.redis = {
    // your redis configurations
  };
  ```

- In `app.js`

```js
// app.js

module.exports = app => {
  // set redis session store
  // session store must have 3 methods
  // define sessionStore in `app.js` so you can access `app.redis`
  app.sessionStore = {
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
  };
};
```

Once you use external session store, session is strong dependent on your external store, you can't access session if your external store is down. **Use external session stores only if necessary, avoid use session as a cache, keep session lean and stored by cookie!**

## Configuration

Support all configurations in [koa-session](https://github.com/koajs/session).

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
