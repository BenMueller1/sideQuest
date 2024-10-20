const express = require("express");
// const { haversineDistance } = require("../util/haversineDist");
const haversineDistance = require("../util/haversineDist");
// const distanceFunction = require("../util/haversineDist");
const prisma = require("./../models/index");
const { hashPassword, verifyPassword } = require("./../util/userFunctions");
const { embed } = require("../util/eventEmbeddings");

const router = express.Router();

function intersection(arr1, arr2) {
  return arr1.filter((item) => arr2.includes(item));
}

async function fetchUser(userId){
  const result = await prisma.user.findUnique({
    where: {
      id: parseInt(userId),
    },
    select: {
      id: true,
      name: true,
      age: true,
      gender: true,
      about: true,
      hometown: true,
      latitude: true,
      longitude: true,
      interests: true,
    },
  });
  return result;
}

// get a user by id
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
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
      return null;
    } else {
      res.status(200).json(result);
      return result;
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
})

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
      console.log(error.message);
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
    } else if (await verifyPassword(password, result.hashed_password)) {
      res.status(200).json(result);
    } else {
      res.status(403).json({ error: "Incorrect password." });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

router.get("/feed/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: { interests: { select: { id: true } } },
    });

    user.interests = user.interests.map((interest) => interest.id);

    let result = await prisma.event.findMany({
      include: { interests: { select: { id: true } } },
    });

    result.forEach((event) => {
      event.interests = event.interests.map((interest) => interest.id);
    });

    if (user.latitude && user.longitude) {
      result = result.filter(
        (event) =>
          haversineDistance(
            event.latitude,
            event.longitude,
            user.latitude,
            user.longitude
          ) < 25
      );
    }

    if (user.interests.length > 0) {
      result = result.sort((a, b) => {
        const commonA = intersection(a.interests, user.interests).length;
        const commonB = intersection(b.interests, user.interests).length;

        return commonB - commonA;
      });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/embarkations/:userId", async (req, res) => {
  const { userId } = req.params;
  //TODO: change
  const DISTANCE_LIMIT = 20;
  try {
    const result = await prisma.embarkation.findMany({
      where: {
        userId: parseInt(userId),
      },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/profile/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
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
      return null;
    } else {
      res.status(200).json(result);
      return result;
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
});

router.post("/edit", async (req, res) => {
  const {
    userId,
    name,
    age,
    gender,
    about,
    hometown,
    latitude,
    longitude,
    interests,
  } = req.body;

  console.log(interests.length);

  try {
    const result = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        name,
        age: parseInt(age),
        gender,
        about,
        hometown,
        latitude,
        longitude,
        interests: {
          set: interests.map((interest) => ({
            id: interest.id,
          })),
        },
      },
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        about: true,
        hometown: true,
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
    const result = await prisma.interest.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.get("/quiz", async (req, res) => {
  try {
    const result = await prisma.question.findMany({
      orderBy: {
        questionNumber: "asc",
      },
    });
    

    res.status(200).json(result);
  } catch (error) {
    
    res.status(400).json({ error: error.message });
  }
});

router.post("/quiz", async (req, res) => {
  const { userId, answers } = req.body;
  const sentimentMap = {
    1: "Strongly disagrees with",
    2: "Somewhat disagrees with",
    3: "Is neutral towards",
    4: "Somewhat agrees with",
    5: "Strongly agrees with",
  };

  try {
    const result = await prisma.question.findMany({ orderBy: { id: "asc" } });

    let inputString = "";

    for (let [key, value] of Object.entries(answers)) {
      const question = result.find((obj) => obj.id == key);

      inputString += `${sentimentMap[value]} the statement "${question.question}" `;
    }

    const embedding = await embed(256, inputString);

    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        personaEmbedding: embedding,
      },
    });

    res.status(200).send(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
