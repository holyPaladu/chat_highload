import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  HttpStatus,
  HttpCode,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, CheckOtpDto, ResendOtpDto } from './dto/auth.dto';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { BaseResponse, OtpCheckResponse } from './interface/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: CreateUserDto })
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'User register' })
  async register(@Body() body: CreateUserDto): Promise<BaseResponse> {
    return this.authService.register(body);
  }

  @Post('check-otp')
  @ApiBody({ type: CheckOtpDto })
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'User verified otp' })
  async checkOtp(@Body() body: CheckOtpDto): Promise<OtpCheckResponse> {
    return this.authService.checkOtp(body.email, body.otp);
  }
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: ResendOtpDto })
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'User resend otp' })
  async resendOtp(@Body() body: ResendOtpDto): Promise<BaseResponse> {
    try {
      await this.authService.createdOtp(body.email);
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'OTP успешно отправлен',
      };
    } catch (error) {
      console.error('Ошибка при повторной отправке OTP:', error);
      throw new InternalServerErrorException(
        'Не удалось отправить OTP, попробуйте позже',
      );
    }
  }
}
