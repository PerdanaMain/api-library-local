import jwt from "jsonwebtoken";

export const VerifyToken = (req, res, next) => {
  // get token from header
  const authorization = req.headers["authorization"];

  if (authorization) {
    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Token is missing",
      });
    } else {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(401).json({
            status: false,
            message: "Unauthorized",
          });
        }

        req.user = user;
        next();
      });
    }
  } else {
    return res.status(401).json({
      status: false,
      message: "Authorization header missing",
    });
  }
};
