import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly redisCache: CacheService,
  ) {}

  async register(
    body: CreateUserDto,
  ): Promise<{ statusCode: HttpStatus; success: boolean; message?: string }> {
    if (await this.userService.userExists(body.email)) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    await this.userService.createUser(body);

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const cacheKey = `user_${body.email}_otp`;

    try {
      await this.redisCache.setCacheWithRetry(cacheKey, otp, 10 * 60);
    } catch (error) {
      console.error('Ошибка сохранения OTP в Redis:', error);
    }

    return { statusCode: HttpStatus.CREATED, success: true };
  }
}
