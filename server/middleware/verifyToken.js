const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  let token = req.cookies.jwt_token;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!user) {
      return res.clearCookie("jwt_token");
    }
    next();
  } catch (error) {
    res.clearCookie("jwt_token");
    res.json(error);
  }
};

module.exports = validateToken;
