// const request = require('supertest');
// const app = require('../app'); // Ensure this points to your app

// describe('User Endpoints', function() {
//   // Loop to create 10 users
//   for (let i = 1; i <= 10; i++) {
//     describe(`User ${i}`, function() {
//       let email = `user${i}@example.com`;
//       let password = 'password123';
      
//       it(`should register user ${i}`, function(done) {
//         const userData = {
//           name: `User ${i}`,
//           email: email,
//           password: password,
//           role: 'attendee', // Change role as needed
//           description: `A brief description about User ${i}.`,
//           age: 20 + i // Example to vary the age
//         };

//         request(app)
//           .post('/users/register')
//           .send(userData)
//           .expect(201)
//           .end(done);
//       });

//       it(`should login user ${i}`, function(done) {
//         const loginData = {
//           email: email,
//           password: password
//         };

//         request(app)
//           .post('/users/login')
//           .send(loginData)
//           .expect(200, done);
//       });
//     });
//   }
// });
