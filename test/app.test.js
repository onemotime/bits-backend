const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const argon2 = require('argon2');
const User = require('../model/User');
const { MESSAGE } = require('../constans');

describe('APP TEST', function () {
  this.timeout(7000);

  const mongoose = require('mongoose');
  const db = mongoose.connection;

  const unhashedMockUser = {
    email: 'test@test.com',
    password: 'test',
    userName: 'testName'
  };

  let mockUser = null;
  let mockUserId = null;
  let token = null;

  const createUser = async () => {
    const hashedPassword = await argon2.hash('test', 10);

    mockUser = {
      email: 'test@test.com',
      password: hashedPassword,
      userName: 'testName'
    };

    const user = await User.create(mockUser);

    mockUserId = user._id;
  };

  const deleteUser = async () => {
    await User.findByIdAndDelete(mockUserId);
  };

  before((done) => {
    (function checkDatabaseConnection() {
      if (db.readyState === 1) {
        return done();
      }

      setTimeout(checkDatabaseConnection, 1000);
    })();
  });

  before(createUser);
  after(deleteUser);

  beforeEach((done) => {
    request(app)
      .post('/user/login')
      .send(unhashedMockUser)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        token = res.body.accessToken;

        done();
      });
  });

  afterEach(() => {
    token = null;
  });

  describe('GET `/user/all`', () => {
    it('should get all users', (done) => {
      request(app)
        .get('/user/all')
        .set('Authorization', `${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          const users = res.body.payload.users;

          expect(users).to.exist;
          expect(Array.isArray(users)).to.be.true;

          done();
      });
    });
  });

  describe('GET `/user/following`', () => {
    it('should get following users', (done) => {
      request(app)
        .get('/user/following')
        .set('Authorization', `${token}`)
        .send({ email: mockUser.email })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          const { status, followingUserHabits } = res.body;

          expect(status).to.eql(200);
          expect(Array.isArray(followingUserHabits)).to.be.true;

          done();
        });
    });
  });

  describe('PATCH `/user/image`', () => {
    it('should patch user image', (done) => {
      request(app)
        .patch('/user/image')
        .set('Authorization', `${token}`)
        .send({ uri: 'testImgUri' })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          const { status, uri } = res.body;

          expect(status).to.eql(201);
          expect(uri).to.eql('testImgUri');

          done();
        });
    });
  });
});
