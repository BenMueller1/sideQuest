const express = require("express");
const prisma = require("./../models/index");

const router = express.Router();

// fetch all groups that a user is in
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await prisma.group.findMany({
      where: {
        users: {
          some: {
            id: parseInt(userId),
          },
        },
      },
      include: {
        users: true,
        messages: true,
      }
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// get all messages from a group
router.get("/messages/:groupId", async (req, res) => {
  const { groupId } = req.params;

  try {
    const result = await prisma.message.findMany({
      where: {
        groupId: parseInt(groupId),
      },
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// add a message to a group
router.post("/message", async (req, res) => {
  const { groupId, senderId, content } = req.body;

  console.log('data passed to message create endpoint');
  console.log(JSON.stringify(req.body));

  try {
    const result = await prisma.message.create({
      data: {
        content: content,
        // userId: parseInt(senderId),
        sender: {
          connect: {
            id: parseInt(senderId),
          },
        },
        // groupId: parseInt(groupId),
        group: {
          connect: {
            id: parseInt(groupId),
          },
        },
        seenBy: [parseInt(senderId)], // of cours you've seen your own message by default
      },
    });

    res.status(201).json(result);
  } catch (error) {
    console.log('error creating message: ', error);
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;