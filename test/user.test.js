// Using CommonJS syntax
const request = require('supertest');
const assert = require('assert');
const app = require('../app'); // Adjust the path to your Express app entry file

// Using ES Modules syntax (rename the file to `user.test.mjs`)
// import request from 'supertest';
// import assert from 'assert';
// import app from '../app.mjs'; // Make sure to export your Express app in this file

describe('User Endpoints', function() {
  let createdUserId;

  describe('POST /users/register', function() {
    it('should register a new user and return user info', function(done) {
      request(app)
        .post('/users/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'password123',
          role: 'attendee'
        })
        .expect(201)
        .end(function(err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.body.user.email, 'testuser@example.com');
          assert.strictEqual(res.body.user.role, 'attendee');
          createdUserId = res.body.user._id;
          done();
        });
    });
  });

  describe('GET /users/:userId', function() {
    it('should return user info for the given user ID', function(done) {
      request(app)
        .get(`/users/${createdUserId}`)
        .expect(200)
        .end(function(err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.body._id, createdUserId);
          assert.strictEqual(res.body.email, 'testuser@example.com');
          done();
        });
    });
  });

  // Add more tests as needed...
});
