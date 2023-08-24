const { response } = require("express");
const express = require("express");
const Student = require("../models/Student");
const Class = require("../models/Class");
const router = express.Router();


// Route to change the section of a student within a class
router.put('/change-student-section', async (req, res) => {
    try {
      const { studentId, newSection } = req.body;
  
      // Find the student by ID
      const student = await Student.findById(studentId);
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Find the class by ID
      const selectedClass = await Class.findById(student.class);
  
      if (!selectedClass) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      // Find the new section within the class
      const newSectionExists = selectedClass.sections.some(sec => sec.sectionName === newSection);
  
      if (!newSectionExists) {
        return res.status(404).json({ message: 'New section not found in the class' });
      }
  
      // Remove the student from the current section
      const currentSection = selectedClass.sections.find(sec => sec.students.includes(studentId));
      if (currentSection) {
        currentSection.students.pull(studentId);
      }
  
      // Add the student to the new section
      const newSectionIndex = selectedClass.sections.findIndex(sec => sec.sectionName === newSection);
      selectedClass.sections[newSectionIndex].students.push(studentId);
  
      await selectedClass.save();
  
      res.status(200).json({ message: 'Student section changed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error changing student section', error: error.message });
    }
  });
  
  // Route to shift students up one class based on examination results
// Route to shift students up one class based on examination results
router.put('/shift-students-up', async (req, res) => {
    try {
      const { passingPercentage } = req.body;
  
      // Find the classes
      const classes = await Class.find();
  
      if (!classes) {
        return res.status(404).json({ message: 'No classes found' });
      }
  
      // Iterate through each class
      for (const selectedClass of classes) {
        for (const section of selectedClass.sections) {
          // Filter students who have passed the Final Term Examination
          const passedStudents = [];
  
          for (const studentId of section.students) {
            const student = await Student.findById(studentId);
            if (!student) {
              continue;
            }
  
            // Find the "Final Term" examination results for the student
            const finalTermResults = await Result.find({
              student: studentId,
              exam: { $in: student.examinationResults.filter(result => result.examType === 'Final Term').map(result => result.exam) }
            });
  
            // Calculate total marks and percentage
            let totalMarks = 0;
            let obtainedMarks = 0;
            for (const result of finalTermResults) {
              totalMarks += result.totalMarks;
              obtainedMarks += result.subjectResults.reduce((sum, subjResult) => sum + subjResult.marksObtained, 0);
            }
  
            const percentage = (obtainedMarks / totalMarks) * 100;
  
            if (percentage >= passingPercentage) {
              passedStudents.push(studentId);
            }
          }
  
          // Move passed students to the next class's section
          if (passedStudents.length > 0) {
            const nextClass = await Class.findById(selectedClass.nextClass);
  
            if (nextClass) {
              const nextSection = nextClass.sections.find(sec => sec.sectionName === section.sectionName);
  
              if (nextSection) {
                nextSection.students.push(...passedStudents);
                section.students = section.students.filter(studentId => !passedStudents.includes(studentId));
              }
            }
          }
        }
        await selectedClass.save();
      }
  
      res.status(200).json({ message: 'Students shifted up successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error shifting students up', error: error.message });
    }
  });
  

  module.exports = router;