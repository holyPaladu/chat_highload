import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class NotificationService {
  constructor(private readonly redisCache: CacheService) {}

  async test(email: string) {
    const cacheKey = `user_${email}_otp`;
    const cacheOtp = await this.redisCache.getCache(cacheKey);
    return cacheOtp;
  }
}
