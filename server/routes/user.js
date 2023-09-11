const express = require("express");
const jwt = require("jsonwebtoken");
const { User, Admin, Course } = require("../db");
const { authenticateJWT, SECRETKEY } = require("../middleware/auth");

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;
  const user =
    (await User.findOne({ username })) || (await User.findOne({ email }));
  if (!user) {
    const newUser = new User({ email, username, password });
    await newUser.save();
    const token = jwt.sign({ username, role: "user" }, SECRETKEY, {
      expiresIn: "1h",
    });
    res.json({ message: "User created successfully", token });
  } else {
    res.status(403).send({ message: "User already exists" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ username, role: "user" }, SECRETKEY, {
      expiresIn: "1h",
    });
    res.json({ message: "Logged in successfully", token, user });
  } else {
    res.status(403).send({ message: "User not found" });
  }
});

router.get("/me", authenticateJWT, async (req, res) => {
  const user = req.user;
  res.json({user});
});

// Get courses Available
router.get("/courses", async (req, res) => {
  const courses = await Course.find({ published: true });
  res.json({ courses });
});

// Find course by ID
router.get("/courses/:id", async (req, res) => {
  const id = req.params.id;
  const course = await Course.findById(id);
  res.json({ course });
});

// Buy Course
router.post("/courses/:id", authenticateJWT, async (req, res) => {
  const courseId = req.params.id;
  const course = await Course.findById(courseId);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const user = await User.findOne({ username: req.user.username });

  if (!user) {
    return res.status(403).json({ message: "User not found" });
  }

  // Check if the user has already purchased the course
  if (user.purchasedCourses.includes(courseId)) {
    return res.status(400).json({ message: "Course already purchased" });
  }

  // If the user has not purchased the course, add it to their purchasedCourses array
  user.purchasedCourses.push(courseId);
  await user.save();
  res.json({ message: "Course purchased successfully" });
});


// Show Purchased courses
router.get("/purchasedCourses", authenticateJWT, async (req, res) => {
  const user = await User.findOne({ username: req.user.username }).populate(
    "purchasedCourses"
  );
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: "User not found" });
  }
});

module.exports = router;