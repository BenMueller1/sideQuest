const express = require("express");
const eventRoutes = require("./routes/eventRoutes");
require("./cron/jobs");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/events", eventRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
