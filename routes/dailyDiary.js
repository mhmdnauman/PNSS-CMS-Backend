const { response } = require("express");
const express = require("express");
const Student = require("../models/Student");
const Class = require("../models/Class");
const Teacher = require("../models/Teacher");
const router = express.Router();

router.get("/teacher/:teacherId/classes-sections", async (req, res) => {
    try {
      const teacherId = req.params.teacherId;
  
      const teacher = await Teacher.findById(teacherId)
        .populate("assignedClasses", "className")
        .populate("sectionsTaught.class", "className")
        .exec();
  
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
  
      const assignedClasses = teacher.assignedClasses;
      const sectionsTaught = teacher.sectionsTaught;
  
      res.status(200).json({ assignedClasses, sectionsTaught });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  });

  router.post("/teacher/add-diary", async (req, res) => {
    try {
      const { date, classId, section, subjects } = req.body;
  
      // Check if the teacher is assigned to the specified class
      const teacherId = req.user.Teacher.id; // Assuming you have user authentication
      const teacher = await Teacher.findById(teacherId);
      
      if (!teacher || !teacher.assignedClasses.includes(classId)) {
        return res.status(403).json({ message: "You are not authorized to add a diary for this class" });
      }
  
      // Create or update the diary entry
      let diaryEntry = await DailyDiary.findOneAndUpdate(
        { date, class: classId, section },
        { $set: { subjects } },
        { upsert: true, new: true }
      );
  
      res.status(201).json({ message: "Diary entry added successfully", diaryEntry });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  });

  router.get("/daily-diary/:classId/:section/:subject", async (req, res) => {
    try {
      const { classId, section, subject } = req.params;
  
      // Retrieve the daily diary entry
      const diaryEntry = await DailyDiary.findOne(
        { class: classId, section, "subjects.subjectName": subject },
        { "subjects.$": 1 }
      );
  
      if (!diaryEntry) {
        return res.status(404).json({ message: "Daily diary entry not found" });
      }
  
      res.status(200).json(diaryEntry.subjects[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  });

  router.get("/daily-diary/:classId/:section", async (req, res) => {
    try {
      const { classId, section } = req.params;
  
      // Retrieve the daily diary entry
      const diaryEntry = await DailyDiary.findOne(
        { class: classId, section }
      );
  
      if (!diaryEntry) {
        return res.status(404).json({ message: "Daily diary entry not found" });
      }
  
      res.status(200).json(diaryEntry);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  });

  router.put("/teacher/edit-diary/:diaryId", async (req, res) => {
    try {
      const diaryId = req.params.diaryId;
      const { subjects } = req.body;
  
      // Find the diary entry by ID
      const diaryEntry = await DailyDiary.findById(diaryId);
  
      if (!diaryEntry) {
        return res.status(404).json({ message: "Diary entry not found" });
      }
  
      // Check if the teacher is authorized to edit this entry
      const teacherId = req.user.Teacher.id; // Assuming you have user authentication
      const teacher = await Teacher.findById(teacherId);
  
      if (!teacher || !teacher.assignedClasses.includes(diaryEntry.class)) {
        return res.status(403).json({ message: "You are not authorized to edit this diary entry" });
      }
  
      // Update the diary entry with new subjects content
      diaryEntry.subjects = subjects;
      await diaryEntry.save();
  
      res.status(200).json({ message: "Diary entry updated successfully", diaryEntry });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  });
  

module.exports = router;