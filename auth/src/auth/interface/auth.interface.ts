import { HttpStatus } from '@nestjs/common';

export interface BaseResponse {
  statusCode: HttpStatus;
  success: boolean;
  message?: string;
}

export interface OtpCheckResponse extends BaseResponse {}
