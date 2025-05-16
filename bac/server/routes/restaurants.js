const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/", async (req, res) => {
  const { lat, lng } = req.query;
  try {
    const response = await fetch(`https://api.ola.maps/poi?type=restaurant&lat=${lat}&lng=${lng}&radius=5000`);
    const data = await response.json();
    res.json(data.restaurants);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

module.exports = router;