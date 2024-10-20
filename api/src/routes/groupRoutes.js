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

module.exports = router;