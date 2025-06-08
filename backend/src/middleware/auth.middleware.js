import jwt from 'jsonwebtoken';

export const verifyAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = data.userId;
    return next();
  } catch (error) {
    return res.sendStatus(403);
  }
};
