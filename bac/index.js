const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const restaurantsRoute = require("./server/routes/restaurants");
const routeRoute = require("./server/routes/route");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/restaurants", restaurantsRoute);
app.use("/api/route", routeRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
