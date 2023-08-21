import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { Observable } from 'rxjs';

/**
 * Issue #1: Session Token bug
 * Found a bug in CurrentUserInterceptor that makes it imposible to signup if there was a previous
 * unclosed session and the session cookie was saved into the HTTP client.
 * It returns a 404 error saying that it wasn't possible to find the user
 * TODO: Solve this bug
 */

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { id } = request.session || {};

    if (id) {
      const user = await this.usersService.findById(id);

      request.CurrentUser = user;
    }

    return handler.handle();
  }
}
