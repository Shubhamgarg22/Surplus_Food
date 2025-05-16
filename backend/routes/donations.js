const express = require("express");
const router = express.Router();
const Donation = require("../model/Donatio");

// GET all donations with filters
router.get("/", async (req, res) => {
  const { status, foodType, search } = req.query;
  const query = {};

  if (status && status !== "all") query.status = status;
  if (foodType && foodType !== "all") query.foodType = foodType;
  if (search) query.foodType = new RegExp(search, "i");

  const donations = await Donation.find(query).sort({ createdAt: -1 });
  res.json(donations);
});

// POST new donation
router.post("/", async (req, res) => {
  const newDonation = new Donation(req.body);
  const saved = await newDonation.save();
  res.status(201).json(saved);
});

// PUT update donation
router.put("/:id", async (req, res) => {
  const updated = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE donation
router.delete("/:id", async (req, res) => {
  await Donation.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;  // <--- THIS
