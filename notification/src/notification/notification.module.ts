import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheRedisModule } from 'src/cache/cache.module';

@Module({
  imports: [CacheModule.register(), CacheRedisModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [CacheModule],
})
export class NotificationModule {}
