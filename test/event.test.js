describe('Event Endpoints', function() {
    let createdEventId;
  
    it('should register a new event', function(done) {
      request(app)
        .post('/events/register')
        .send({
          name: 'Tech Conference 2023',
          location: 'New York, NY',
          startingDate: '2023-10-10',
          endingDate: '2023-10-12',
          description: 'Annual tech conference',
          organizer: 'ORGANIZER_USER_ID' // Use an actual user ID
        })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          createdEventId = res.body.event._id;
          done();
        });
    });
  
    // Add more event tests as needed...
  });
  