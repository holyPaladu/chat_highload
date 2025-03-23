import { Module } from '@nestjs/common';
import { JwtModuleCustom } from './jwt/jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheRedisModule } from './cache/cache.module';
import redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    JwtModuleCustom,
    TypeOrmModule.forRoot(databaseConfig),
    ConfigModule.forRoot(),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        socket: {
          host: configService.get<string>('REDIS_HOST', 'redis'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
        ttl: 10,
      }),
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
