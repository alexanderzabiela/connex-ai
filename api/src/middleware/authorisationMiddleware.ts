import { Request, Response, NextFunction } from 'express';

export const authorisationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorisation'];

  if (authHeader === 'mysecrettoken') {
    next();
  } else {
    res.sendStatus(403);
  }
};
