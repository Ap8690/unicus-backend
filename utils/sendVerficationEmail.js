const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `https://unicus.one/login/${verificationToken}/${email}`;

  const message = `<p>Please confirm your email by clicking on the following link : 
  <a href="${verifyEmail}">Verify Email</a> </p>`;

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4> Hello ${name.charAt(0).toUpperCase() + name.slice(1)},</h4>
    ${message}
    `,
  });
};

module.exports = sendVerificationEmail;

