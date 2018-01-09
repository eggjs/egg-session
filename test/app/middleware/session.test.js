'use strict';

const sleep = require('mz-modules/sleep');
const request = require('supertest');
const assert = require('assert');
const mm = require('egg-mock');

describe('test/app/middlewares/session.test.js', () => {
  let app;
  let agent;
  afterEach(mm.restore);

  describe('sesionStore', () => {

    before(() => {
      app = mm.app({ baseDir: 'memory-session' });
      return app.ready();
    });
    beforeEach(() => {
      agent = request.agent(app.callback());
    });
    after(() => app.close());

    it('should get sessionStore', function* () {
      mm.empty(app.sessionStore, 'set');
      yield agent
      .get('/set?foo=bar')
      .expect(200)
      .expect({ foo: 'bar' })
      .expect('set-cookie', /EGG_SESS=.*?;/);

      yield agent.get('/get')
      .expect(200)
      .expect({});
    });

    it('should session store can be change', function* () {
      mm(app.config, 'env', 'local');

      yield agent
      .get('/set?foo=bar')
      .expect(200)
      .expect({ foo: 'bar' })
      .expect('set-cookie', /EGG_SESS=.*?;/);

      yield agent.get('/get')
      .expect(200)
      .expect({ foo: 'bar' });

      app.sessionStore = null;

      yield agent.get('/get')
      .expect(200)
      .expect({});
    });
  });

  [
    'cookie-session',
    'memory-session',
    'redis-session',
  ].forEach(name => {
    describe(name, () => {
      before(() => {
        app = mm.app({
          baseDir: name,
          cache: false,
        });
        return app.ready();
      });
      beforeEach(() => {
        agent = request.agent(app.callback());
      });
      after(() => app.close());

      if (name === 'redis-session') {
        it('should get with ', function* () {
          yield agent
            .get('/set?foo=bar')
            .expect(200)
            .expect({ foo: 'bar' })
            .expect('set-cookie', /EGG_SESS=.*?;/);

          mm.empty(app.redis, 'get');

          yield agent
            .get('/get')
            .expect(200)
            .expect({});
        });
      }

      it('should get empty session and do not set cookie when session not populated', function* () {
        yield agent
        .get('/get')
        .expect(200)
        .expect({})
        .expect(res => {
          assert(!res.header['set-cookie'].join('').match(/EGG_SESS/));
        });
      });

      it('should ctx.session= change the session', function* () {
        yield agent
        .get('/set?foo=bar')
        .expect(200)
        .expect({ foo: 'bar' })
        .expect('set-cookie', /EGG_SESS=.*?;/);
      });

      it('should ctx.session.key= change the session', function* () {
        yield agent
        .get('/set?key=foo&foo=bar')
        .expect(200)
        .expect({ key: 'foo', foo: 'bar' })
        .expect('set-cookie', /EGG_SESS=.*?;/);

        yield agent
        .get('/setKey?key=bar')
        .expect(200)
        .expect({ key: 'bar', foo: 'bar' })
        .expect('set-cookie', /EGG_SESS=.*?;/);
      });

      it('should ctx.session=null remove the session', function* () {
        yield agent
        .get('/set?key=foo&foo=bar')
        .expect(200)
        .expect({ key: 'foo', foo: 'bar' })
        .expect('set-cookie', /EGG_SESS=.*?;/);

        yield agent
        .get('/remove')
        .expect(204)
        .expect('set-cookie', /EGG_SESS=;/);

        yield agent
        .get('/get')
        .expect(200)
        .expect({});
      });

      it('should ctx.session.maxAge= change maxAge', function* () {
        yield agent
        .get('/set?key=foo&foo=bar')
        .expect(200)
        .expect({ key: 'foo', foo: 'bar' })
        .expect('set-cookie', /EGG_SESS=.*?;/);

        let cookie;

        yield agent
        .get('/maxAge?maxAge=100')
        .expect(200)
        .expect({ key: 'foo', foo: 'bar' })
        .expect(res => {
          cookie = res.headers['set-cookie'].join(';');
          assert(cookie.match(/EGG_SESS=.*?;/));
          assert(cookie.match(/expires=/));
        });

        yield sleep(200);

        yield agent
        .get('/get')
        .expect(200)
        .expect({});

        yield request(app.callback())
        .get('/get')
        .set('cookie', cookie)
        .expect(200)
        .expect({});
      });
    });
  });
});
