const bcrypt = require("bcrypt");

async function hashPassword(plainPassword) {
  const saltRounds = 10; // Number of salt rounds to make it harder to crack
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
  }
}

async function verifyPassword(plainPassword, hashedPassword) {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);

    return match;
  } catch (error) {
    console.error("Error verifying password:", error);
  }
}

module.exports = { hashPassword, verifyPassword };
