const mongoose = require("mongoose");

const dailyDiarySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  section: String,
  content: String,
  notes: String,
  attachments: [String],
});

module.exports = mongoose.model("DailyDiary", dailyDiarySchema);
