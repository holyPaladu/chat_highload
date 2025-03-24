import { Module } from '@nestjs/common';
import { JwtModuleCustom } from './jwt/jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheRedisModule } from './cache/cache.module';
import redisStore from 'cache-manager-redis-yet';

@Module({
  imports: [
    JwtModuleCustom,
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
    AuthModule,
    UsersModule,
    CacheRedisModule,
  ],
  controllers: [],
  providers: [],
  exports: [CacheModule],
})
export class AppModule {}
