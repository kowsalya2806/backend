const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const {
  getStudents,
  createStudents,
} = require("../controllers/studentController");

router.get("/", getStudents);

router.post("/", createStudents);

module.exports = router;
