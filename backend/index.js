import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './database.js';
import GoogleUser from './schema.js'
import cros from 'cors';
const app = express();

app.use(express.json());
app.use(cros());
connectDB()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

app.post("/auth/google", async (req, res) => {
  try {
    const { sub, email, name } = req.body; // JWT payload fields
    const accessToken = req.body.accessToken || "";

    if (!sub || !email || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }


    const user = await GoogleUser.findOneAndUpdate(
      { googleId: sub },
      { email, name, accessToken },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: "User saved successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Google user info by googleId or email
app.get("/auth/google/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;

    const user = await GoogleUser.findOne({
      $or: [{ googleId: identifier }, { email: identifier }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
