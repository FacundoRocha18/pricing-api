/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

interface CustomRequest extends Request {
  currentUser?: User;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const { id } = req.session || {};

    console.log(req.session);

    if (id) {
      const user = await this.usersService.findById(id);

      req.currentUser = user;
    }

    next();
  }
}
