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

```js
// {app_root}/config/plugin.js
exports.session = {
  package: 'egg-session',
};
```

## Configuration

Support all configurations in [koa-session](https://github.com/koajs/session).

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
