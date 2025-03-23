import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheRedisModule } from 'src/cache/cache.module';

@Module({
  imports: [CacheModule.register(), UsersModule, CacheRedisModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [CacheModule],
})
export class AuthModule {}
