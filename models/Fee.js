const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  paidAmount: Number,
  remainingAmount: Number,
  paymentDates: [Date],
  paymentMethod: String,
});

module.exports = mongoose.model("Fee", feeSchema);
