// const request = require('supertest');
// const app = require('../app'); // Make sure this path points to your Express app

// describe('Camera Endpoints', function() {
//   this.timeout(10000); // Set default timeout for all tests in this block to 5000ms

//   let createdCameraIds = [];

//   // Function to generate random camera data
//   const getRandomCameraData = () => {
//     const manufacturers = ['Nikon', 'Canon', 'Sony', 'Panasonic', 'Fujifilm'];
//     const models = ['D3500', 'EOS Rebel T7', 'A6100', 'Lumix GH5', 'X-T30'];
//     const qualities = ['1080p', '4K', '720p'];
//     const fpsOptions = [24, 30, 60];

//     return {
//       manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
//       name: `${manufacturers[Math.floor(Math.random() * manufacturers.length)]} ${models[Math.floor(Math.random() * models.length)]}`,
//       model: models[Math.floor(Math.random() * models.length)],
//       supportedQuality: qualities[Math.floor(Math.random() * qualities.length)],
//       framesPerSecond: fpsOptions[Math.floor(Math.random() * fpsOptions.length)]
//     };
//   };

//   // Create five cameras with random data
//   for (let i = 0; i < 5; i++) {
//     it(`should create camera ${i + 1}`, function(done) {
//       request(app)
//         .post('/cameras/add')
//         .send(getRandomCameraData())
//         .expect(201)
//         .end((err, res) => {
//           if (err) return done(err);
//           createdCameraIds.push(res.body.camera._id); // Assuming response structure includes camera details
//           done();
//         });
//     });
//   }

//   // Delete the first created camera
//   it('should delete the first created camera', function(done) {
//     request(app)
//       .delete(`/cameras/remove/${createdCameraIds[0]}`)
//       .expect(200)
//       .end(done);
//   });
// });
