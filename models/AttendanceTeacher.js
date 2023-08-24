const mongoose = require("mongoose");

const attendanceTeacherSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  attendanceList: [
    {
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
      },
      status: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Attendance", attendanceTeacherSchema);
