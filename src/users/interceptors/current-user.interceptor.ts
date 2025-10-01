import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';

// Even if we inject currentUser in a CurrentUserInterceptor,
// we can’t use that data in middleware or guards
// because middleward and guards run before interceptors.
// So we should convert the CurrentUserInterceptor into middleware,
// so guards can use currentUser as well.
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};

    if (!userId) return handler.handle();

    const user = await this.usersService.findOne(userId);
    request.currentUser = user;

    return handler.handle();
  }
}
