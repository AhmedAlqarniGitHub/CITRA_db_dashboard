describe('User Endpoints', function() {
  let createdUserId;

  it('should register a new user', function(done) {
    request(app)
      .post('/users/register')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'attendee'
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        createdUserId = res.body.user._id;
        done();
      });
  });

  it('should login the registered user', function(done) {
    request(app)
      .post('/users/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password123'
      })
      .expect(200, done);
  });

  // Add more user tests as needed...
});
