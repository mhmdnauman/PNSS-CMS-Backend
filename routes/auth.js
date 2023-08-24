const { response } = require("express");
const express = require("express");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Admin = require("../models/Admin");
const Class = require("../models/Class");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../Middleware/fetchUser");
const fetchTeacher = require("../Middleware/fetchTeacher");
const fetchAdmin = require("../Middleware/fetchAdmin");

const JWT_SECRET = "Helloo!!Youarecute$#@";


router.post(
    "/admission",
    [
      body("firstName", "firstName length should be minimum 3").isLength({ min: 3 }),
      body("lastName", "lastName length should be minimum 3").isLength({ min: 3 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        if (await Student.findOne({ registrationNumber: req.body.registrationNumber })) {
          return res
            .status(400)
            .json({ errors: "An account is already created with this Registration Number" });
        }

  
        const salt = await bcrypt.genSalt(10);
        const SecPassword = await bcrypt.hash("PNSS@123456", salt);
        const selectedClass = await Class.findById(req.body.selectedClassId);

        const highestRegistration = await Student.findOne().sort({ registrationNumber: -1 });

        let nextRegistrationNumber = 1; // Default for the first student
        if (highestRegistration) {
          nextRegistrationNumber = parseInt(highestRegistration.registrationNumber) + 1;
        }

        let newStudent = await Student({
            registrationNumber: nextRegistrationNumber.toString(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            gender: req.body.gender,
            contactInformation: req.body.contactInformation,
            address: req.body.address,
            parentDetails: req.body.parentDetails,
            class: selectedClass._id,
            section: req.body.section,
            password: SecPassword
        });
        newStudent
          .save()
          .then(async (data) => {
            const Data = {
              Student: {
                id: Student.id,
              },
            };
  

             const selectedClass = await Class.findById(selectedClass._id);

          if (!selectedClass) {
            return res.status(404).json({ message: 'Class not found' });
          }

          // Find the specific section within the class
          const selectedSection = selectedClass.sections.find(sec => sec.sectionName === req.body.section);

          if (!selectedSection) {
            return res.status(404).json({ message: 'Section not found in the class' });
          }

          // Check if the student is already in the section
          if (selectedSection.students.includes(Student.Id)) {
            return res.status(409).json({ message: 'Student already exists in the section' });
          }

          // Add the student to the section
          selectedSection.students.push(Student.Id);

          await selectedClass.save();



            const AuthToken = jwt.sign(Data, JWT_SECRET);
            res.json({ AuthToken });
          })
          .catch((error) => {
            res.json(error);
          });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Some internal server error occured");
      }
    }
  );

  router.post(
    "/student/login",
    [
      body("registrationNumber", "Enter a valid Registration Number").exists(),
      body("password", "Passsword Cannot be Blank").exists(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { registrationNumber, password } = req.body;
      try {
       
        let user = await Student.findOne({ registrationNumber });
        
        if (!user) {
          return res
            .status(400)
            .json({ errors: "Sorry the user does not exist" });
        }
  
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
          return res.status(400).json({ errors: "Incorrect Password" });
        }
  
        const Data = {
          Student: {
            id: user.id,
          },
        };
        console.log(Data);
        const AuthToken = jwt.sign(Data, JWT_SECRET);
        res.json({ AuthToken });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Some internal server error occured");
      }
    }
  );

  router.get(
    "/student/getuser",
    fetchUser,
  
    async (req, res) => {
      try {

       let userID = req.user.id;
       console.log(userID)
        const user = await Student.findById(userID).select("-password");
        res.send(user)
        console.log(user)
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Some internal server error occured");
      }
    }
  );

  //Teacher's APIs Below

  router.post(
    "/teacher/add",
    [
      body("firstName", "firstName length should be minimum 3").isLength({ min: 3 }),
      body("lastName", "lastName length should be minimum 3").isLength({ min: 3 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        if (await Teacher.findOne({ phoneNo: req.body.phoneNo })) {
          return res
            .status(400)
            .json({ errors: "An account is already created with this Phone Number" });
        }

  
        const salt = await bcrypt.genSalt(10);
        const SecPassword = await bcrypt.hash("PNSS-STAFF@123", salt);
       
        let newTeacher = await Teacher({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNo: req.body.phoneNo,
          assignedClasses: req.body.assignedClasses,
          subjectsTaught: req.body.subjectsTaught,
          age: req.body.age,
          gender: req.body.gender,
          qualification: req.body.qualification,
          address: req.body.address,
          password: SecPassword 
        });
        newTeacher
          .save()
          .then((data) => {
            const Data = {
              Teacher: {
                id: Teacher.id,
              },
            };
  
            const AuthToken = jwt.sign(Data, JWT_SECRET);
            res.json({ AuthToken });
          })
          .catch((error) => {
            res.json(error);
          });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Some internal server error occured");
      }
    }
  );

  router.post(
    "/teacher/login",
    [
      body("phoneNo", "Enter a valid Phone Number").exists(),
      body("password", "Passsword Cannot be Blank").exists(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { phoneNo, password } = req.body;
      try {
       
        let user = await Teacher.findOne({ phoneNo });
        
        if (!user) {
          return res
            .status(400)
            .json({ errors: "Sorry the user does not exist" });
        }
  
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
          return res.status(400).json({ errors: "Incorrect Password" });
        }
  
        const Data = {
          Teacher: {
            id: user.id,
          },
        };
        console.log(Data);
        const AuthToken = jwt.sign(Data, JWT_SECRET);
        res.json({ AuthToken });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Some internal server error occured");
      }
    }
  );

  router.get(
    "/teacher/getuser",
    fetchTeacher,
  
    async (req, res) => {
      try {

       let userID = req.user.id;
       console.log(userID)
        const user = await Teacher.findById(userID).select("-password");
        res.send(user)
        console.log(user)
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Some internal server error occured");
      }
    }
  );

//Admin APIs Below

router.post(
  "/admin/add",
  [
    body("firstName", "firstName length should be minimum 3").isLength({ min: 3 }),
    body("lastName", "lastName length should be minimum 3").isLength({ min: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      if (await Admin.findOne({ phoneNo: req.body.username })) {
        return res
          .status(400)
          .json({ errors: "An account is already created with this Username" });
      }


      const salt = await bcrypt.genSalt(10);
      const SecPassword = await bcrypt.hash(req.body.password, salt);
     
      let newAdmin = await Admin({
        username: req.body.username,
        password: SecPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.role
      });
      newAdmin
        .save()
        .then((data) => {
          const Data = {
            Admin: {
              id: Admin.id,
            },
          };

          const AuthToken = jwt.sign(Data, JWT_SECRET);
          res.json({ AuthToken });
        })
        .catch((error) => {
          res.json(error);
        });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some internal server error occured");
    }
  }
);

router.post(
  "/admin/login",
  [
    body("username", "Enter a valid Username").exists(),
    body("password", "Passsword Cannot be Blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    try {
     
      let user = await Admin.findOne({ username });
      
      if (!user) {
        return res
          .status(400)
          .json({ errors: "Sorry the user does not exist" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ errors: "Incorrect Password" });
      }

      const Data = {
        Admin: {
          id: user.id,
        },
      };
      console.log(Data);
      const AuthToken = jwt.sign(Data, JWT_SECRET);
      res.json({ AuthToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some internal server error occured");
    }
  }
);

router.get(
  "/admin/getuser",
  fetchAdmin,

  async (req, res) => {
    try {

     let userID = req.user.id;
     console.log(userID)
      const user = await Admin.findById(userID).select("-password");
      res.send(user)
      console.log(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some internal server error occured");
    }
  }
);


module.exports = router;