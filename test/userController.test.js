// const jwt = require('jsonwebtoken');
// const request = require('supertest');
// const { expect } = require('chai');
// const app = require('../app');
// const { ROUTES, MESSAGE } = require('../constans');
// const User = require('../model/User');

// describe('user controller', () => {
//   describe('<POST user/signup>', function () {
//     this.timeout(10000);

//     const userForRequest = {
//       email: 'onemo@naver.com',
//       userName: 'onemo',
//       password: 'abc'
//     };

//     it('should reponse with message and status', (done) => {
//       request(app)
//         .post(`${ROUTES.USER}${ROUTES.SIGNUP}`)
//         .send(userForRequest)
//         .expect(201)
//         .end(async (err, res) => {
//           if (err) return done(err);

//           const { status, message } = res.body;

//           expect(status).to.eql(201);
//           expect(message).to.eql(MESSAGE.USER_SIGNEDUP_SUCCESS);

//           done();
//         });
//     });
//   });
// });
