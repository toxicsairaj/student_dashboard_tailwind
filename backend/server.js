require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Student = require("./student");

const app = express();
app.use(cors());
app.use(express.json());

// GET students
app.get("/students", async (req, res) => {
  const all = await Student.find();
  res.json(all);
});

// ADD student
app.post("/students", async (req, res) => {
  const st = new Student(req.body);
  await st.save();
  res.json(st);
});

// UPDATE student
app.put("/students/:id", async (req, res) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE student
app.delete("/students/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

const MONGO = process.env.MONGO_URI || "";
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO)
  .then(() => console.log("Mongo connected"))
  .catch(() => console.log("Mongo failed, running without DB"));

app.listen(PORT, () => console.log("Server running", PORT));
