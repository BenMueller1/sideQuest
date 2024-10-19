const express = require("express");
const prisma = require("./../models/index");
const { hashPassword } = require("./../util/userFunctions");

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
    }
    res.status(400).json({ error: error.message });
  }
});

// router.post("/login", async (req, res) => {
//     const {email, }
// })

module.exports = router;
