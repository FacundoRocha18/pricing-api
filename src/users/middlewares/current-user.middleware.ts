/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req. || {};

    if (userId) {
      const user = await this.usersService.findById(userId);

      // @ts-ignore
      req.currentUser = user;
    }

    next();
  }
}
