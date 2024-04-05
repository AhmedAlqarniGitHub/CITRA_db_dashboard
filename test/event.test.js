const request = require('supertest');
const app = require('../app.js'); // Ensure this points to your app

describe('Event Endpoints', function() {
    this.timeout(10000); 
  // Array of organizer user IDs and corresponding event details
  const eventsInfo = [
    {
      organizer: '660720849045c0664e4cb45e',
      name: 'Global Tech Summit 2023',
      location: 'San Francisco, CA',
      startingDate: '2024-01-15T09:00:00Z',
      endingDate: '2024-12-17T17:00:00Z',
      description: 'A premier technology conference bringing together industry leaders from around the world.',
      status: 'active'
    },
    {
      organizer: '660720849045c0664e4cb45e',
      name: 'International Design Conference 2023',
      location: 'Berlin, Germany',
      startingDate: '2024-01-15T09:00:00Z',
      endingDate: '2024-12-17T17:00:00Z',
      description: 'Explore the future of design with experts from various fields and discover the latest trends.',
      status: 'active'
    },
    {
      organizer: '660720849045c0664e4cb45e',
      name: 'Health & Wellness Expo 2023',
      location: 'London, UK',
      startingDate: '2024-01-15T09:00:00Z',
      endingDate: '2024-12-17T17:00:00Z',
      description: 'Dedicated to showcasing innovations in health, wellness, and nutrition for a healthier tomorrow.',
      status: 'active'
    }
  ];

  eventsInfo.forEach((event, index) => {
    it(`should register event: ${event.name}`, function(done) {
      request(app)
        .post('/events/register')
        .send({
          name: event.name,
          location: event.location,
          startingDate: event.startingDate,
          endingDate: event.endingDate,
          description: event.description,
          organizer: event.organizer,
          status: event.status
        })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          // Optionally capture the createdEventId if needed for further tests
          let createdEventId = res.body.event._id;
          console.log(`Event created: ${event.name} with ID: ${createdEventId}`);
          done();
        });
    });
  });

  // Add more event tests or cleanup logic as needed...
});
