const mongoose = require("mongoose");

const WalletTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: { type: Number, required: true, default: 0 },
    type: { type: String, default: "" }, //credit, debit
    reason: { type: String, default: "" }, //wallet recharged, Placed Bid, Bid reversed
    transactionObj: {},
  },
  { timestamps: true }
);

module.exports = mongoose.model("WalletTransactions", WalletTransactionSchema);
