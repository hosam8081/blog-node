import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid Token" });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res
      .status(401)
      .json({ message: "Authorization token must be 'Bearer [token]'" });
  }
};

const authorizePermissions = (permission) => {
  return (req, res, next) => {
    // console.log(req.user);
    if (req.user.permissions.includes(permission) || req.user.isAdmin) {
      next();
    } else {
      res.status(401).json({ message: "you don't have permission to access this route" });
    }
  };
};

export { authMiddleware, authorizePermissions };
