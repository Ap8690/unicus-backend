const sendEmail = require("./sendEmail");

const sendBidRefundEmail = async ({
  email,
  username,
  lastBid,
  currentBid,
  origin,
  nftId,
}) => {
  const message = `<p>Your bid of ${lastBid} has been successfully returned to your wallet. The current high bid is ${currentBid}.</p><br>
  <p>View and bid live <a href='${origin}/auction/${nftId}'>here</a>.</p>`;
  const footer = `<h5>Thank you</h5><br>
    <h4> Unicus Team </h4>`;
  return sendEmail({
    to: email,
    subject: `${lastBid} bid returned to your wallet`,
    html: `<h4>Hello ${
      username.charAt(0).toUpperCase() + username.slice(1)
    },</h4><br><br>
   ${message}
   ${footer}
   `,
  });
};

module.exports = sendBidRefundEmail;
