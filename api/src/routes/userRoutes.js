const express = require("express");
const prisma = require("./../models/index");
const { hashPassword, verifyPassword } = require("./../util/userFunctions");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const hashed_password = await hashPassword(password);

  try {
    const result = await prisma.user.create({
      data: {
        email,
        hashed_password,
      },
    });

    res.status(200).json(result);
  } catch (error) {
    if (error.code === "P2002") {
      res.status(409).json({
        error: "There is already an account associated with this email.",
      });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!result) {
      res.status(404).json({ error: "User with this email not found." });
    }

    if (verifyPassword(password, result.hashed_password)) {
      res.sendStatus(200);
    } else {
      res.status(403).json({ error: "Incorrect password." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/profile/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        about: true,
        latitude: true,
        longitude: true,
        interests: true,
      },
    });

    if (!result) {
      res.status(404).json({ error: "User not found - invalid user ID" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/edit", async (req, res) => {
  const { userId, name, age, gender, about, latitude, longitude } = req.body;

  try {
    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        age,
        gender,
        about,
        latitude,
        longitude,
      },
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        about: true,
        latitude: true,
        longitude: true,
        interests: true,
      },
    });

    res.status(201).json(result);
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

router.get("/interests", async (req, res) => {
  try {
    const result = await prisma.interest.findMany();
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post("/interests", async (req, res) => {
  const { userId, interests } = req.body;

  try {
    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        interests: {
          connect: interests.map((id) => ({ id })),
        },
      },
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        about: true,
        latitude: true,
        longitude: true,
        interests: true,
      },
    });

    res.status(201).json(result);
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

module.exports = router;
