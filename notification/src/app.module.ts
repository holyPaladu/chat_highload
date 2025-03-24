import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheRedisModule } from './cache/cache.module';
import redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ConfigModule.forRoot(),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        console.log('Подключаем Redis');
        return {
          store: redisStore,
          host: configService.get<string>('REDIS_HOST', 'chat_redis_cache'),
          port: configService.get<number>('REDIS_PORT', 6379),
          ttl: 600, // 10 минут
        };
      },
    }),
    CacheRedisModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
  exports: [CacheModule],
})
export class AppModule {}
