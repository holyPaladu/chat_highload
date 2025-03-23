import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  providers: [CacheService],
  exports: [CacheModule, CacheService],
})
export class CacheRedisModule {}
