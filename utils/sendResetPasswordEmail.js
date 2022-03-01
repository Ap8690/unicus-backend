const sendEmail = require("./sendEmail");

const sendResetPassswordEmail = async ({ name, email, token, origin }) => {
  const resetURL = `${origin}/reset-password/${token}/${email}`;
  const message = `<p>Please reset password by clicking on the following link : 
  <a href="${resetURL}">Reset Password</a></p>`;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello ${name.charAt(0).toUpperCase() + name.slice(1)},</h4>
   ${message}
   `,
  });
};

module.exports = sendResetPassswordEmail;
