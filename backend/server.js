const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const donationRoutes = require("./routes/donations");

app.use(express.json());
app.use("/api/donations", donationRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});
