const express = require("express");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
require("./cron/jobs");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/events", eventRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
