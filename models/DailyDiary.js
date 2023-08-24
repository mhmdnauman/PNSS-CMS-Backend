const mongoose = require("mongoose");

const dailyDiarySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  section: String,
  subjects: [
    {
      subjectName: { type: String, required: true },
      content: String,
    },
  ],
});

module.exports = mongoose.model("DailyDiary", dailyDiarySchema);
