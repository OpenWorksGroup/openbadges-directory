var nodemailer = require('nodemailer'),
    config     = require('./config');

exports.transport = nodemailer.createTransport('SMTP', {
  service: config('EMAIL_SERVICE'),
  auth: {
    user: config('EMAIL_USER'),
    pass: config('EMAIL_PASS')
  }
});