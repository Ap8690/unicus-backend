const sendEmail = require("./sendEmail");

const sendBidEmail = async ({ email, username, currentBid }) => {
  const message = `<p>Your bid of ${currentBid} has been successfully placed. you are the current highest bidder.</p><br><br>`;
  const footer = `<h5>Thank you</h5><br>
    <h4> Unicus Team </h4>`;
  return sendEmail({
    to: email,
    subject: `Bid Confirmation`,
    html: `<h4>Hello ${
      username.charAt(0).toUpperCase() + username.slice(1)
    },</h4><br><br>
   ${message}
   ${footer}
   `,
  });
};

module.exports = sendBidEmail;
