import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authentication = async (req, res, next: NextFunction): Promise<void> => {
  const token = req.get('authorization').replace('Bearer ', '').trim();

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: Error, decoded) => {
    if (err) {
      res.status(401).send({ error: 'Você não está autenticado!' });
    } else {
      const { iat, exp, ...rest } = decoded;
      req.user = rest;
      next();
    }
  });
};
