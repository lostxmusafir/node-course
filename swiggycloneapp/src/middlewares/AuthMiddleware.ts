import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariables } from '../environments/environments';

export class AuthMiddleware {
  static verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({
          message: 'Authorization token is required',
        });
      }

      const token = authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).send({
          message: 'Authorization token is required',
        });
      }

      const env = getEnvironmentVariables();
      const decoded = jwt.verify(
        token,
        env.jwt_secret
      );

      (req as any).user = decoded;
      next();
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).send({
          message: 'Token Expired',
          error: error.message,
        });
      }
      return res.status(401).send({
        message: 'Invalid Authorization Token',
        error: error.message,
      });
    }
  }

  static adminRole(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user;
    if (user.type !== 'admin') {
      return res.status(401).json({
        message: 'You are not authorized to perform this action',
        status_code: 401,
      });
    }
    next();
  }
}
