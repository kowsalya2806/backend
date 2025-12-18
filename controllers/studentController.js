const Student = require("../models/Student");

const getStudents = async (req, res) => {
  const students = await Student.find();
  if (students) {
    res.status(200).json(students);
  } else {
    res.status(404).json({ error: "No students found" });
  }
};

const createStudents = async (req, res) => {
  try {
    const { name, age, roll_no, class: std } = req.body;
    const student = await Student.create({ name, age, roll_no, class: std });
    res.status(201).json({ message: "Student created successfully", student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getStudents, createStudents };
