const { response } = require("express");
const express = require("express");
const Student = require("../models/Student");
const Class = require("../models/Class");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../Middleware/fetchUser");

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
          .then((data) => {
            const Data = {
              Student: {
                id: Student.id,
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
    "/Student/login",
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

  router.post(
    "/Student/getuser",
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

module.exports = router;