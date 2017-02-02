'use strict';

const fs = require('fs');
const request = require('supertest');
const assert = require('assert');
const mm = require('egg-mock');
const path = require('path');

describe('test/app/middlewares/session.test.js', () => {

  describe('using cookie store', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir: 'koa-session',
      });
      return app.ready();
    });
    afterEach(mm.restore);

    it('should work when userId change', done => {
      app.mockContext({
        userId: 's1',
      });
      request(app.callback())
      .get('/?uid=1')
      .expect({
        userId: 's1',
        sessionUid: '1',
        uid: '1',
      })
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(res.headers['set-cookie']);
        const cookie = res.headers['set-cookie'].join(';');
        assert(/EGG_SESS=[\w-]+/.test(cookie));

        // get the former session when userId is not changed.
        app.mockContext({
          userId: 's1',
        });
        request(app.callback())
        .get('/?uid=2&userId=s1')
        .set('Cookie', cookie)
        .expect({
          userId: 's1',
          sessionUid: '1',
          uid: '2',
        })
        .expect(200, (err, res) => {
          if (err) return done(err);
          assert(!res.headers['set-cookie']);

          // userId change, session still not change
          app.mockContext({
            userId: 's2',
          });
          request(app.callback())
          .get('/?uid=2')
          .set('Cookie', cookie)
          .expect({
            userId: 's2',
            sessionUid: '1',
            uid: '2',
          })
          .expect(res => {
            assert(!res.headers['set-cookie']);
          })
          .expect(200, err => {
            if (err) return done(err);
            request(app.callback())
            .get('/clear')
            .set('Cookie', cookie)
            .expect('set-cookie', /EGG_SESS=;/, done);
          });
        });
      });
    });

    it('should work when userId missing', done => {
      app.mockContext({
        userId: 's1',
      });
      request(app.callback())
      .get('/?uid=1')
      .expect({
        userId: 's1',
        sessionUid: '1',
        uid: '1',
      })
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(res.headers['set-cookie']);
        const cookie = res.headers['set-cookie'].join(';');
        assert(/EGG_SESS=[\w-]+/.test(cookie));

        // userId 不变，还是读取到上次的 session 值
        app.mockContext({
          userId: 's1',
        });
        request(app.callback())
        .get('/?uid=2&userId=s1')
        .set('Cookie', cookie)
        .expect({
          userId: 's1',
          sessionUid: '1',
          uid: '2',
        })
        .expect(200, (err, res) => {
          if (err) return done(err);
          assert(!res.headers['set-cookie']);

          // userId change, session still not change
          app.mockContext({
            userId: '',
          });
          request(app.callback())
          .get('/?uid=2')
          .set('Cookie', cookie)
          .expect({
            sessionUid: '1',
            uid: '2',
            userId: '',
          })
          .expect(res => {
            assert(!res.headers['set-cookie']);
          })
          .expect(200, err => {
            if (err) return done(err);
            request(app.callback())
            .get('/clear')
            .set('Cookie', cookie)
            .expect('set-cookie', /EGG_SESS=;/, done);
          });
        });
      });
    });
  });

  describe('cookie exceed', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir: 'large-cookie-session',
      });
      return app.ready();
    });
    after(() => app.close());
    afterEach(mm.restore);

    it('should log error', done => {
      request(app.callback())
      .get('/')
      .expect(200)
      .end(err => {
        assert.ifError(err);
        const errorPath = path.join(__dirname, '../../fixtures/large-cookie-session/logs/large-cookie-session/common-error.log');
        const body = fs.readFileSync(errorPath, 'utf8');
        assert(/nodejs.CookieLimitExceedError: Max cookie limit is 4093, but got 5506/.test(body));
        done();
      });
    });
  });
});
