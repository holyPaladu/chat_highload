import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dto/auth.dto';
import { CacheService } from 'src/cache/cache.service';
import { BaseResponse, OtpCheckResponse } from './interface/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly redisCache: CacheService,
  ) {}

  async register(body: CreateUserDto): Promise<BaseResponse> {
    const user = await this.userService.userExists(body.email);
    if (user) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    await this.userService.createUser(body);
    await this.createdOtp(body.email);
    return { statusCode: HttpStatus.CREATED, success: true };
  }

  async checkOtp(email: string, otp: string): Promise<OtpCheckResponse> {
    const cacheKey = `user_${email}_otp`;
    const cacheOtp = await this.redisCache.getCache(cacheKey);

    if (!cacheOtp) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
        message: 'OTP не найден или истёк срок действия',
      };
    }

    if (cacheOtp === otp) {
      await this.redisCache.deleteCache(cacheKey);
      await this.userService.userVerifiedEmail(email);
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'OTP успешно подтверждён',
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        success: false,
        message: 'Неверный OTP',
      };
    }
  }
  async createdOtp(email: string): Promise<void> {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const cacheKey = `user_${email}_otp`;

    try {
      await this.redisCache.setCacheWithRetry(cacheKey, otp, 60 * 15);
    } catch (error) {
      console.error('Ошибка сохранения OTP в Redis:', error);
    }
  }
}
