const mongoose = require("mongoose");

const LoanModel = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    principle: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    interest: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    dueDate: { type: Date },
    status: { type: String },
  },
  {
    timestamps: true,
  }
);

exports.LoanModel = mongoose.model("Loan", LoanModel);
