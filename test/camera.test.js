describe('Camera Endpoints', function() {
    let createdCameraId;
  
    it('should create a new camera', function(done) {
      request(app)
        .post('/cameras/add')
        .send({
          manufacturer: 'Canon',
          name: 'Canon EOS 5D',
          supportedQuality: '4K',
          framesPerSecond: 60
        })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          createdCameraId = res.body.camera._id;
          done();
        });
    });
  
    it('should delete the created camera', function(done) {
      request(app)
        .delete(`/cameras/remove/${createdCameraId}`)
        .expect(200, done);
    });
  });
  