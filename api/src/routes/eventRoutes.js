const express = require("express");
const prisma = require("./../models/index");
const { embed, k_nearest } = require("./../util/eventEmbeddings");
const matchingService = require("./../util/matchingService");
const haversineDistance = require("./../util/haversineDist");

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
    const event = await prisma.event.create({
      data: {
        title,
        description,
        latitude,
        longitude,
        capacity,
      },
    });
    console.log("prisma event:" + event);
    const interests = await prisma.interest.findMany();

    event.embedding = await embed(256, `${event.name}: ${event.description}`);

    const tags = k_nearest(5, interests, event);

    const ids = tags.map((tag) => tag.id);

    const result = await prisma.event.update({
      where: { id: event.id },
      data: {
        interests: {
          connect: ids.map((id) => ({ id })),
        },
      },
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/embark", async (req, res) => {
  const { userId, eventId } = req.body;

  try {
    const result = await prisma.embarkation.create({
      data: {
        userId,
        eventId,
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
    console.log("bm ERROR");
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

router.post("/match", async (req, res) => {
  await matchingService();

  res.sendStatus(200);
});

module.exports = router;
