import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getCache(key: string): Promise<string | undefined | null> {
    return this.cacheManager.get(key);
  }

  async deleteCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async setCacheWithRetry(
    key: string,
    value: string,
    ttl: number,
    retries = 2, // Число повторных попыток при ошибке
  ): Promise<void> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        await this.cacheManager.set(key, value, ttl);
        return; // Если успешно записали, выходим из функции
      } catch (error) {
        console.error(
          `Ошибка записи в Redis (попытка ${attempt + 1}/${retries + 1}):`,
          error,
        );
        if (attempt < retries) {
          await this.delay(100 * Math.pow(2, attempt)); // Экспоненциальная задержка (100ms, 200ms, 400ms)
        } else {
          throw error; // После последней попытки выбрасываем ошибку
        }
      }
    }
  }
}
