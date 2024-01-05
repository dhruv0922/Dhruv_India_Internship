const Queue = require('bull');
const mailer = require('./app');

const sendMailQueue = new Queue('sendMail', {
  redis: {
    host: '127.0.0.1',
    port: 6380,
    // password: 'root'
  }
});

module.exports = sendMailQueue; // Export the queue instance
