const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  foodType: String,
  quantity: Number,
  pickupDate: Date,
  expiryDate: Date,
  location: String,
  notes: String,
  photo: String,
  status: String,
  createdAt: Date,
});

module.exports = mongoose.model("Donation", donationSchema);
