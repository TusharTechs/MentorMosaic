const jwt = require("jsonwebtoken");
const { User } = require("../db");
const SECRETKEY = "your_secret_key";

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, SECRETKEY, async(err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      const userdata = await User.findOne({username:user.username})
      req.user = userdata;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { authenticateJWT, SECRETKEY };
