'use strict';

const request = require('supertest');
const assert = require('assert');
const mm = require('egg-mock');

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
});
