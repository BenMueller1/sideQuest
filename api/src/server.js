const express = require("express");
const cors = require("cors");

const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
require('dotenv').config();
require("./cron/jobs");
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());
app.use("/events", eventRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
