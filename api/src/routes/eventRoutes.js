const express = require("express");
const prisma = require("./../models/index");

const router = express.Router();

router.post("/create", async (req, res) => {
  const { title, description, latitude, longitude, capacity } = req.body;
  try {
    const result = await prisma.event.create({
      data: {
        title,
        description,
        latitude,
        longitude,
        capacity,
      },
    });
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
