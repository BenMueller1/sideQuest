const express = require("express");
const cors = require('cors');
const eventRoutes = require("./routes/eventRoutes");
require("./cron/jobs");
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());
app.use("/events", eventRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
