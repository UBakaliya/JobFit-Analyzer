const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateJWTAccessToken = (user) => {
  const token = jwt.sign(
    { email: user.email, username: user.username, _id: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "12h" }
  );
  return token;
};

const validateToken = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.cookie.split("=")[1];

    if (authorizationHeader) {
      const user = await jwt.verify(
        authorizationHeader,
        process.env.JWT_SECRET_KEY
      );
      // Validate the token
      if (user) {
        req.user = user;
        next();
      } else {
        // Invalid token
        return res.status(401).json({ error: "Invalid token" });
      }
    } else {
      // No authorization header found
      res.status(401).json({ error: "No authorization header found" });
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

module.exports = { validateToken, generateJWTAccessToken };
