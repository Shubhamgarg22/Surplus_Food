const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/", async (req, res) => {
  const { from, to } = req.query;
  const [fromLat, fromLng] = from.split(",");
  const [toLat, toLng] = to.split(",");

  try {
    const response = await fetch(`https://api.ola.maps/route?origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&mode=bike`);
    const data = await response.json();
    res.json({ route: data.route });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch route" });
  }
});

module.exports = router;