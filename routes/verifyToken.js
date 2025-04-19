const jwt = require("jsonwebtoken");

// Middleware to verify JWT if present (for optional auth, like guest checkout)
const verifyTokenOptional = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) return res.status(403).json("TOKEN IS NOT VALID");
      req.user = user;
      next();
    });
  } else {
    // No token provided – allow guest to continue
    next();
  }
};

// Middleware to require JWT (used for protected routes)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) return res.status(403).json("TOKEN IS NOT VALID");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("YOU SHALL NOT PASS!!!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenOptional,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
