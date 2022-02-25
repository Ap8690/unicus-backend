const sendEmail = require("./sendEmail");

const sendAuctionSoldEmail = async ({ email, username, imageHash, name, lastBid }) => {
  const message = `<p><b><h6>Congratulations</h6></b></p>
  <p>You won the auction for <a href='${imageHash}'>${name}</a> with a winning bid of ${lastBid}.</p><br><br>`;
  const footer = `<h5>Thank you</h5><br>
    <h4> Unicus Team </h4>`;
  return sendEmail({
    to: email,
    subject: `Auction Ended`,
    html: `<h4>Hello ${
      username.charAt(0).toUpperCase() + username.slice(1)
    },</h4><br><br>
   ${message}
   ${footer}
   `,
  });
};

module.exports = sendAuctionSoldEmail;
