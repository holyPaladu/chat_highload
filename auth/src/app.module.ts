import { Module } from '@nestjs/common';
import { JwtModuleCustom } from './jwt/jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [JwtModuleCustom, TypeOrmModule.forRoot(databaseConfig)],
  controllers: [],
  providers: [],
})
export class AppModule {}
