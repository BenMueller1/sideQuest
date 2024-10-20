const express = require("express");
const prisma = require("./../models/index");

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const result = await prisma.event.findMany();
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

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
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/embark", async (req, res) => {
  const { userId, eventId, timeslots } = req.body;

  try {
    const result = await prisma.embarkation.create({
      data: {
        userId,
        eventId,
        timeslots,
      },
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/embark/:embarkationId", async (req, res) => {
  // grab embarkationId
  const { embarkationId } = req.params;

  try {
    const result = await prisma.embarkation.delete({
      where: {
        id: parseInt(embarkationId),
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.log('bm ERROR');
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

router.get("/embarkations/:eventId", async (req, res) => {
  const { eventId } = req.params;

  try {
    const result = await prisma.embarkation.count({
      where: {
        eventId: parseInt(eventId),
      },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
