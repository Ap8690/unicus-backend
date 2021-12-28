require('dotenv').config();

module.exports = {
  service: 'gmail',
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};
